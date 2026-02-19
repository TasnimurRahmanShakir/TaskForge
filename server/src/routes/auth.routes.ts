import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { loginSchema, registerSchema } from "../utils/schemas/auth.schema";
import upload from "../middlewares/uploadMiddleware";

const router = Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validate(registerSchema),
  register,
);

router.post("/login", validate(loginSchema), login);

export default router;
