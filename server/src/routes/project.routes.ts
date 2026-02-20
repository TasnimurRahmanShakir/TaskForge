import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
  getProjectActivity,
} from "../controllers/project.controller";
import { protect } from "../middlewares/authMiddleware";
import validate from "../middlewares/validate";
import { authorize } from "../middlewares/rbacMiddleware";
import { GlobalRole } from "@prisma/client";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../utils/schemas/project.schema";

const router = Router();

// All project routes are protected
router.use(protect);

router.post(
  "/create",
  authorize(GlobalRole.SUPER_USER, GlobalRole.PROJECT_MANAGER),
  validate(createProjectSchema),
  createProject,
);
router.get("/", getProjects);
router.get("/search", getProject);
router.patch(
  "/:id",
  authorize(GlobalRole.SUPER_USER, GlobalRole.PROJECT_MANAGER),
  validate(updateProjectSchema),
  updateProject,
);
router.delete(
  "/:id",
  authorize(GlobalRole.SUPER_USER, GlobalRole.PROJECT_MANAGER),
  deleteProject,
);

router.get("/:id/activity", getProjectActivity);

export default router;
