import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTaskById,
  getTasks,
  updateTask,
  toggleChecklistItem,
} from "../controllers/task.controller";
import { protect } from "../middlewares/authMiddleware";
import validate from "../middlewares/validate";
import { authorize } from "../middlewares/rbacMiddleware";
import { GlobalRole } from "@prisma/client";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../utils/schemas/task.schema";

const router = Router();

// All task routes are protected
router.use(protect);

router.post("/", validate(createTaskSchema), createTask);
router.get("/", getTasks);
router.get("/search", getTask);
router.get("/:id", getTaskById);
router.patch("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:taskId/checklist/:itemId/toggle", toggleChecklistItem);
router.delete(
  "/:id",
  authorize(GlobalRole.SUPER_USER, GlobalRole.PROJECT_MANAGER),
  deleteTask,
);

export default router;
