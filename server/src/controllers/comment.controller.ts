import { Response } from "express";
import prisma from "../config/db";
import catchAsync from "../utils/catchAsync";
import { AuthRequest } from "../middlewares/authMiddleware";

/**
 * @openapi
 * /api/comments:
 *   post:
 *     summary: Create a new comment on a task
 *     tags: [Comments]
 */
export const createComment = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { content, taskId } = req.body;
    const authorId = req.user!.id;

    if (!content || !taskId) {
      return res.status(400).json({
        status: "error",
        message: "Please provide content and taskId for the comment.",
      });
    }

    // Verify task exists and user has access (project member)
    const task = await prisma.task.findUnique({
      where: { id: taskId as string },
      include: {
        project: { include: { members: { where: { userId: authorId } } } },
      },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found or you don't have access to comment.",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, profileImage: true },
        },
      },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        description: `Commented on task: "${task.title}" by ${req.user!.name}`,
        taskId: taskId,
        projectId: task.projectId,
        userId: authorId,
      },
    });

    res.status(201).json({
      status: "success",
      data: { comment },
    });
  },
);

/**
 * @openapi
 * /api/comments/task/{taskId}:
 *   get:
 *     summary: Get all comments for a specific task
 *     tags: [Comments]
 */
export const getCommentsByTask = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const taskId = req.params.taskId;
    const userId = req.user!.id;

    // Verify access
    const task = await prisma.task.findUnique({
      where: { id: taskId as string },
      include: { project: { include: { members: { where: { userId } } } } },
    });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found or you don't have access.",
      });
    }

    const comments = await prisma.comment.findMany({
      where: { taskId: taskId as string },
      include: {
        author: {
          select: { id: true, name: true, profileImage: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      results: comments.length,
      data: { comments },
    });
  },
);
