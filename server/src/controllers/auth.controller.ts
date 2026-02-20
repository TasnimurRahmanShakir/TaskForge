import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    { id: user.id, email: user.email, role: user.role, name: user.name },
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
        profileImage: user.profileImage,
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

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
export const getMe = catchAsync(async (req: any, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Refresh token is required",
    });
  }

  // 1. Verify token
  let decoded: any;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "refresh_secret",
    );
  } catch (err) {
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired refresh token",
    });
  }

  // 2. Find user and check if token matches
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user || user.refreshToken !== token) {
    return res.status(401).json({
      status: "error",
      message: "Invalid refresh token session",
    });
  }

  // 3. Generate new tokens
  // Note: We issue a new refresh token too (rotation)
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  // 4. Update refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: tokens.refreshToken },
  });

  res.status(200).json({
    status: "success",
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

/**
 * Get all users (Super Admin only)
 */
export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const { search, role } = req.query;
  const searchStr = typeof search === "string" ? search : undefined;
  const roleFilter = typeof role === "string" ? role : undefined;

  const where: any = {};

  if (searchStr) {
    where.OR = [
      { name: { contains: searchStr, mode: "insensitive" as const } },
      { email: { contains: searchStr, mode: "insensitive" as const } },
    ];
  }

  if (roleFilter) {
    where.role = roleFilter;
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

/**
 * Delete user (Super Admin only)
 */
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = typeof id === "string" ? id : undefined;

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "User ID is required.",
    });
  }

  // Prevent self-deletion if needed, or just delete
  await prisma.user.delete({
    where: { id: userId },
  });

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});

/**
 * Update user role (Super Admin only)
 */
export const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const { userId, role } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User role updated successfully",
      data: { user: updatedUser },
    });
  },
);
