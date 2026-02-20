import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import prisma from "../config/db";
import { GlobalRole, ProjectRole } from "@prisma/client";

/**
 * Authorize based on Global Roles
 */
export const authorize = (...roles: GlobalRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role as GlobalRole)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

/**
 * Check Role within a Project
 */
export const checkProjectRole = (allowedRoles: ProjectRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const projectId =
      req.params.projectId || req.body.projectId || req.query.projectId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    if (!projectId) {
      return res.status(400).json({
        status: "error",
        message: "Project ID is required for this check",
      });
    }

    // Super Admins and Project Managers bypass project-level checks
    if (
      req.user?.role === GlobalRole.SUPER_USER ||
      req.user?.role === GlobalRole.PROJECT_MANAGER
    ) {
      return next();
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (!member || !allowedRoles.includes(member.role)) {
      return res.status(403).json({
        status: "error",
        message:
          "You do not have the required project role to perform this action",
      });
    }

    next();
  };
};
