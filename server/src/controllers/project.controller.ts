import { Response } from "express";
import prisma from "../config/db";
import catchAsync from "../utils/catchAsync";
import { AuthRequest } from "../middlewares/authMiddleware";

/**
 * @openapi
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 */
export const createProject = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const {
      name,
      description,
      startDate,
      endDate,
      status,
      tags,
      color,
      managerId: providedManagerId,
      teamLeaderId,
      memberIds = [],
    } = req.body;

    const managerId = providedManagerId || req.user!.id;

    const project = await prisma.$transaction(async (tx) => {
      // 1. Create the project
      const newProject = await tx.project.create({
        data: {
          name,
          description,
          startDate,
          endDate,
          status: status || "ON_TRACK",
          tags,
          color,
          managerId,
          teamLeaderId,
        },
      });

      // 2. Add Manager as OWNER
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: managerId,
          role: "OWNER",
        },
      });

      // 3. Add Team Leader if exists
      if (teamLeaderId && teamLeaderId !== managerId) {
        await tx.projectMember.create({
          data: {
            projectId: newProject.id,
            userId: teamLeaderId,
            role: "LEADER",
          },
        });
      }

      // 4. Add other members
      const uniqueMemberIds = [
        ...new Set(
          memberIds.filter(
            (id: string) => id !== managerId && id !== teamLeaderId,
          ),
        ),
      ];

      if (uniqueMemberIds.length > 0) {
        await tx.projectMember.createMany({
          data: (uniqueMemberIds as string[]).map((userId) => ({
            projectId: newProject.id,
            userId,
            role: "MEMBER",
          })),
        });
      }

      return newProject;
    });

    res.status(201).json({
      status: "success",
      data: { project },
    });
  },
);

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: Get all projects for the current user
 *     tags: [Projects]
 */
export const getProjects = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role;

    let projects;

    if (role === "SUPER_USER" || role === "PROJECT_MANAGER") {
      // Admins and PMs see everything
      projects = await prisma.project.findMany({
        include: {
          manager: {
            select: { id: true, name: true, profileImage: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, profileImage: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Others see only projects they are members of
      projects = await prisma.project.findMany({
        where: {
          members: { some: { userId } },
        },
        include: {
          manager: {
            select: { id: true, name: true, profileImage: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, profileImage: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: { projects },
    });
  },
);

/**
 * @openapi
 * /api/projects/search:
 *   get:
 *     summary: Search for a project by ID or Name
 *     tags: [Projects]
 */
export const getProject = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const query = req.query.query as string; // This can be an ID or a name
    const userId = req.user!.id;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a project ID or name to search.",
      });
    }

    const project = await prisma.project.findFirst({
      where: {
        AND: [
          {
            OR: [
              { id: query },
              { name: { contains: query, mode: "insensitive" } },
            ],
          },
          req.user!.role === "SUPER_USER" ||
          req.user!.role === "PROJECT_MANAGER"
            ? {}
            : { members: { some: { userId } } },
        ],
      },
      include: {
        manager: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
        },
        tasks: true,
      },
    });

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found or you don't have access.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { project },
    });
  },
);

/**
 * @openapi
 * /api/projects/{id}:
 *   patch:
 *     summary: Update a project
 *     tags: [Projects]
 */
export const updateProject = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;

    // Check if project exists and user is manager
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject || existingProject.managerId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this project.",
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({
      status: "success",
      data: { project: updatedProject },
    });
  },
);

/**
 * @openapi
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 */
export const deleteProject = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject || existingProject.managerId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this project.",
      });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);

/**
 * @openapi
 * /api/projects/{id}/activity:
 *   get:
 *     summary: Get all activity logs for a project
 *     tags: [Projects]
 */
export const getProjectActivity = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;

    // Verify access
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: { where: { userId } },
      },
    });

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found.",
      });
    }

    const isAdmin =
      req.user!.role === "SUPER_USER" || req.user!.role === "PROJECT_MANAGER";
    const isMember = project.members.length > 0;

    if (!isAdmin && !isMember && project.managerId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "You don't have access to this project's activity.",
      });
    }

    const activity = await prisma.activityLog.findMany({
      where: { projectId: id },
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      data: { activity },
    });
  },
);
