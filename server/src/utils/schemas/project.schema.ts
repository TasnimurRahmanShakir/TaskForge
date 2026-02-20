import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Project name must be at least 2 characters long"),
    description: z.string().optional().nullable(),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z
      .string()
      .optional()
      .nullable()
      .transform((str) => (str ? new Date(str) : null)),
    status: z.enum(["ON_TRACK", "AT_RISK", "DELAYED", "COMPLETED"]).optional(),
    tags: z.array(z.string()).optional().default([]),
    color: z.string().optional(),
    managerId: z.string().uuid().optional(),
    teamLeaderId: z.string().uuid().optional().nullable(),
    memberIds: z.array(z.string().uuid()).optional().default([]),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional().nullable(),
    startDate: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    endDate: z
      .string()
      .optional()
      .nullable()
      .transform((str) => (str ? new Date(str) : null)),
    status: z.enum(["ON_TRACK", "AT_RISK", "DELAYED", "COMPLETED"]).optional(),
    tags: z.array(z.string()).optional(),
    color: z.string().optional(),
    teamLeaderId: z.string().uuid().optional().nullable(),
  }),
});
