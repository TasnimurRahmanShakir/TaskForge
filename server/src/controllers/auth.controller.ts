import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/db";
import catchAsync from "../utils/catchAsync";
import fs from "fs";
import { generateTokens } from "../utils/generateTokens";

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: "error",
      message: "Invalid email or password",
    });
  }

  // 2. Generate tokens
  const { accessToken, refreshToken } = generateTokens(
    { id: user.id, email: user.email, role: user.role },
    rememberMe || false,
  );

  // 3. Store refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // 4. Send response (excluding password and refresh token per user request)
  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    },
  });
});

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [SUPER_USER, PROJECT_MANAGER, MEMBER]
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already in use
 */
export const register = catchAsync(async (req: any, res: Response) => {
  const { name, email, password, role } = req.body;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Cleanup file if it was uploaded but user exists
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
    return res.status(400).json({
      status: "error",
      message: "Email already in use",
    });
  }

  // 2. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Handle Profile Image URL
  const profileImage = req.file
    ? `/uploads/profiles/${req.file.filename}`
    : null;

  try {
    // 4. Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "MEMBER",
        profileImage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { user },
    });
  } catch (error) {
    // Cleanup file if DB creation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file after DB failure:", err);
      });
    }
    throw error; // Rethrow to let global error handler handle it
  }
});
