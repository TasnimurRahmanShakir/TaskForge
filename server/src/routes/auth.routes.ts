import { Router } from "express";
import {
  login,
  register,
  getMe,
  refreshToken,
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginSchema, registerSchema } from "../utils/schemas/auth.schema";
import upload from "../middlewares/uploadMiddleware";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/rbacMiddleware";
import { GlobalRole } from "@prisma/client";

const router = Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validate(registerSchema),
  register,
);

router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
router.post("/refresh-token", refreshToken);

// User Management (Super Admin & PM for assignment)
router.get(
  "/users",
  protect,
  authorize(GlobalRole.SUPER_USER, GlobalRole.PROJECT_MANAGER),
  getUsers,
);
router.post(
  "/update-role",
  protect,
  authorize(GlobalRole.SUPER_USER),
  updateUserRole,
);
router.delete(
  "/users/:id",
  protect,
  authorize(GlobalRole.SUPER_USER),
  deleteUser,
);

export default router;
