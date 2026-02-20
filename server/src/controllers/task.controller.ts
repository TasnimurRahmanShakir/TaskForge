import { Response, Request } from "express";
import prisma from "../config/db";
import catchAsync from "../utils/catchAsync";
import { AuthRequest } from "../middlewares/authMiddleware";
import { updateProjectProgress } from "../utils/task.utils";

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create a new task within a project
 *     tags: [Tasks]
 */
export const createTask = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const {
      title,
      description,
      priority,
      status,
      tags,
      dueDate,
      estimate,
      image,
      projectId,
      assignees,
      checklist,
    } = req.body;
    const userId = req.user!.id;

    // Verify project exists and user is a member/manager
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { members: { where: { userId } } },
    });

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found.",
      });
    }

    const isManager =
      req.user!.role === "SUPER_USER" ||
      req.user!.role === "PROJECT_MANAGER" ||
      project.managerId === userId;
    const isLeader = project.members.some((m) => m.role === "LEADER");

    if (!isManager && !isLeader) {
      return res.status(403).json({
        status: "error",
        message: "You don't have permission to add tasks to this project.",
      });
    }

    // Map status and priority from Title Case to UPPER_SNAKE_CASE
    const mappedStatus = status
      ? status.toUpperCase().replace(/\s+/g, "_")
      : "BACKLOG";
    const mappedPriority = priority
      ? priority.toUpperCase().replace(/\s+/g, "_")
      : "MEDIUM";

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: mappedPriority as any,
        status: mappedStatus as any,
        tags,
        dueDate,
        estimate,
        image,
        projectId,
        assignees: {
          create: (assignees || []).map((id: string) => ({
            userId: id,
          })),
        },
        checklistItems: {
          create: (checklist || []).map((item: any) => ({
            title: item.title,
            completed: item.completed || false,
          })),
        },
      },
      include: {
        assignees: true,
        checklistItems: true,
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        description: `Task created by ${req.user!.name}`,
        taskId: task.id,
        projectId: projectId,
        userId: userId,
      },
    });

    res.status(201).json({
      status: "success",
      data: { task },
    });
  },
);

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for a specific project
 *     tags: [Tasks]
 */
export const getTasks = catchAsync(async (req: AuthRequest, res: Response) => {
  const { projectId } = req.query;
  const userId = req.user!.id;

  if (!projectId) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a projectId to list tasks.",
    });
  }

  // Verify access and get project role
  const project = await prisma.project.findUnique({
    where: { id: projectId as string },
    include: { members: { where: { userId } } },
  });

  if (!project) {
    return res.status(404).json({
      status: "error",
      message: "Project not found or you don't have access.",
    });
  }

  const projectMember = project.members[0];
  const isGlobalAdmin =
    req.user!.role === "SUPER_USER" || req.user!.role === "PROJECT_MANAGER";
  const isProjectLeader = projectMember?.role === "LEADER";

  let where: any = { projectId: projectId as string };

  if (!isGlobalAdmin && !isProjectLeader) {
    // If just a MEMBER, filter by assigned tasks and active status (To Do/In Progress)
    where = {
      ...where,
      assignees: { some: { userId } },
      status: { in: ["BACKLOG", "IN_PROGRESS"] },
    };
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      assignees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, profileImage: true },
          },
        },
      },
      checklistItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: { tasks },
  });
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 */
export const getTaskById = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true },
        },
        assignees: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profileImage: true },
            },
          },
        },
        checklistItems: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, profileImage: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        activityLogs: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found.",
      });
    }

    // Verify access
    const project = await prisma.project.findUnique({
      where: { id: task.projectId },
      include: { members: { where: { userId } } },
    });

    if (!project && req.user!.role !== "SUPER_USER") {
      return res.status(403).json({
        status: "error",
        message: "You don't have access to this task.",
      });
    }

    res.status(200).json({
      status: "success",
      data: { task },
    });
  },
);

/**
 * @openapi
 * /api/tasks/search:
 *   get:
 *     summary: Search for a task by ID or Title
 *     tags: [Tasks]
 */
export const getTask = catchAsync(async (req: AuthRequest, res: Response) => {
  const query = req.query.query as string;
  const userId = req.user!.id;

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a task ID or title to search.",
    });
  }

  const task = await prisma.task.findFirst({
    where: {
      OR: [{ id: query }, { title: { contains: query, mode: "insensitive" } }],
      project: {
        members: {
          some: { userId },
        },
      },
    },
    include: {
      project: { select: { id: true, name: true } },
      assignees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, profileImage: true },
          },
        },
      },
      checklistItems: true,
    },
  });

  if (!task) {
    return res.status(404).json({
      status: "error",
      message: "Task not found.",
    });
  }

  res.status(200).json({
    status: "success",
    data: { task },
  });
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 */
export const updateTask = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { assignees, checklist, ...updateData } = req.body;

    // Verify access and role
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignees: {
          include: { user: { select: { id: true, name: true } } },
        },
        project: { include: { members: { where: { userId } } } },
      },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found or you don't have access to update it.",
      });
    }

    const projectMember = task.project.members[0];
    const isGlobalAdmin =
      req.user!.role === "SUPER_USER" || req.user!.role === "PROJECT_MANAGER";
    const isProjectMember = task.project.members.length > 0;

    if (!isGlobalAdmin && !isProjectMember) {
      return res.status(403).json({
        status: "error",
        message: "Only Admins/Project Members can update tasks.",
      });
    }

    // Map status and priority from Title Case to UPPER_SNAKE_CASE
    const mappedStatus = updateData.status
      ? updateData.status.toUpperCase().replace(/\s+/g, "_")
      : undefined;
    const mappedPriority = updateData.priority
      ? updateData.priority.toUpperCase().replace(/\s+/g, "_")
      : undefined;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        status: mappedStatus ? (mappedStatus as any) : undefined,
        priority: mappedPriority ? (mappedPriority as any) : undefined,
        assignees: assignees
          ? {
              deleteMany: {},
              create: assignees.map((userId: string) => ({
                userId,
              })),
            }
          : undefined,
        checklistItems: checklist
          ? {
              // Intelligently sync checklist items
              deleteMany: {
                id: {
                  notIn: checklist
                    .filter((item: any) => item.id)
                    .map((item: any) => item.id),
                },
              },
              upsert: checklist.map((item: any) => ({
                where: {
                  id: item.id || "00000000-0000-0000-0000-000000000000",
                },
                update: {
                  title: item.title,
                  completed: item.completed ?? false,
                },
                create: {
                  title: item.title,
                  completed: item.completed ?? false,
                },
              })),
            }
          : undefined,
      },
      include: {
        assignees: true,
        checklistItems: true,
      },
    });

    // ─── Post-Update Actions ──────────────────────────────────────────────────
    await updateProjectProgress(updatedTask.projectId);

    // 2. Log Activity for specific changes
    const changes: string[] = [];
    if (updateData.title && updateData.title !== task.title) {
      changes.push(`Title changed to "${updateData.title}"`);
    }
    if (updateData.status && updateData.status !== task.status) {
      changes.push(`Status changed to ${updateData.status}`);
    }
    if (updateData.priority && updateData.priority !== task.priority) {
      changes.push(`Priority changed to ${updateData.priority}`);
    }
    if (
      updateData.dueDate &&
      updateData.dueDate !== (task.dueDate as any)?.toISOString()?.split("T")[0]
    ) {
      changes.push(`Due date changed to ${updateData.dueDate}`);
    }

    // ─── Assignee Changes ─────────────────────────────────────────────────────
    if (assignees) {
      const oldIds = task.assignees.map((a) => a.userId);
      const newIds = assignees as string[];

      const removed = task.assignees.filter((a) => !newIds.includes(a.userId));
      const addedIds = newIds.filter((id) => !oldIds.includes(id));

      for (const a of removed) {
        changes.push(`Removed ${a.user.name} from the task`);
      }

      if (addedIds.length > 0) {
        const addedUsers = await prisma.user.findMany({
          where: { id: { in: addedIds } },
          select: { name: true },
        });
        for (const u of addedUsers) {
          changes.push(`Added ${u.name} to the task`);
        }
      }
    }

    if (changes.length > 0) {
      await prisma.activityLog.createMany({
        data: changes.map((desc) => ({
          description: `${desc} by ${req.user!.name}`,
          taskId: id,
          projectId: task.projectId,
          userId: userId,
        })),
      });
    } else {
      // Default log if no specific field changed (e.g. description or tags)
      await prisma.activityLog.create({
        data: {
          description: `Task details updated by ${req.user!.name}`,
          taskId: id,
          projectId: task.projectId,
          userId: userId,
        },
      });
    }

    res.status(200).json({
      status: "success",
      data: { task: updatedTask },
    });
  },
);

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 */
export const deleteTask = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found.",
      });
    }

    const isGlobalAdmin =
      req.user!.role === "SUPER_USER" || req.user!.role === "PROJECT_MANAGER";

    if (!isGlobalAdmin) {
      return res.status(403).json({
        status: "error",
        message: "Only Global Admins/Managers can delete tasks.",
      });
    }

    await prisma.task.delete({
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
 * /api/tasks/{taskId}/checklist/{itemId}/toggle:
 *   patch:
 *     summary: Toggle a checklist item's completed status
 *     tags: [Tasks]
 */
export const toggleChecklistItem = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const taskId = req.params.taskId as string;
    const itemId = req.params.itemId as string;
    const userId = req.user!.id;

    // Verify access
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [{ managerId: userId }, { members: { some: { userId } } }],
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found or you don't have access.",
      });
    }

    const item = await prisma.checklistItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.taskId !== taskId) {
      return res.status(404).json({
        status: "error",
        message: "Checklist item not found.",
      });
    }

    const updatedItem = await prisma.checklistItem.update({
      where: { id: itemId },
      data: { completed: !item.completed },
    });

    // ─── Post-Update Actions ──────────────────────────────────────────────────

    // 1. Recalculate Project Progress
    await updateProjectProgress(task.projectId);

    // 2. Log Activity
    await prisma.activityLog.create({
      data: {
        description: `${updatedItem.completed ? "Checked" : "Unchecked"} item: "${updatedItem.title}" in task: "${task.title}"`,
        taskId: taskId,
        userId: userId,
      },
    });

    res.status(200).json({
      status: "success",
      data: { item: updatedItem },
    });
  },
);
