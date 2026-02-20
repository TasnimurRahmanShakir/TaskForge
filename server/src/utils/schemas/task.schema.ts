import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional().nullable(),
    priority: z
      .preprocess(
        (val) =>
          typeof val === "string"
            ? val.toUpperCase().replace(/\s+/g, "_")
            : val,
        z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
      )
      .optional(),
    status: z
      .preprocess(
        (val) =>
          typeof val === "string"
            ? val.toUpperCase().replace(/\s+/g, "_")
            : val,
        z.enum(["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]),
      )
      .optional(),
    tags: z.array(z.string()).optional().default([]),
    dueDate: z
      .string()
      .optional()
      .nullable()
      .transform((str) => (str ? new Date(str) : null)),
    estimate: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    projectId: z.string().uuid("Invalid Project ID"),
    assignees: z.array(z.string().uuid()).optional().default([]),
    checklist: z
      .array(
        z.object({
          title: z.string().min(1),
          completed: z.boolean().optional().default(false),
        }),
      )
      .optional()
      .default([]),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    priority: z
      .preprocess(
        (val) =>
          typeof val === "string"
            ? val.toUpperCase().replace(/\s+/g, "_")
            : val,
        z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
      )
      .optional(),
    status: z
      .preprocess(
        (val) =>
          typeof val === "string"
            ? val.toUpperCase().replace(/\s+/g, "_")
            : val,
        z.enum(["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"]),
      )
      .optional(),
    tags: z.array(z.string()).optional(),
    dueDate: z
      .string()
      .optional()
      .nullable()
      .transform((str) => (str ? new Date(str) : null)),
    estimate: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    projectId: z.string().uuid().optional(),
    assignees: z.array(z.string().uuid()).optional(),
    checklist: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          title: z.string().min(1),
          completed: z.boolean(),
        }),
      )
      .optional(),
  }),
});
