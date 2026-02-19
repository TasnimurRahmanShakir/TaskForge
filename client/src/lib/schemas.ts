import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().default(false).optional(),
});

export const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters." }),
  manager: z.string().min(2, { message: "Manager name is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  status: z.enum(["On Track", "At Risk", "Delayed", "Completed"]),
  teamMembers: z
    .array(z.string())
    .min(1, { message: "Select at least one team member." }),
  color: z.string().min(1, { message: "Please select a theme color." }),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Urgent", "High", "Medium", "Low", "Completed"]),
  assignee: z
    .object({
      name: z.string(),
      image: z.string().optional(),
      initials: z.string().min(1),
    })
    .nullable()
    .optional(),
  dueDate: z.string().optional(),
  estimate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  objectives: z
    .array(
      z.object({ title: z.string(), completed: z.boolean().default(false) }),
    )
    .optional(),
});

// ─── Inferred Form Value Types ────────────────────────────────────────────────
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ProjectFormValues = z.infer<typeof projectSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;
