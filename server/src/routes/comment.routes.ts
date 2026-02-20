import { Router } from "express";
import {
  createComment,
  getCommentsByTask,
} from "../controllers/comment.controller";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// All comment routes are protected
router.use(protect);

router.post("/", createComment);
router.get("/task/:taskId", getCommentsByTask);

export default router;
