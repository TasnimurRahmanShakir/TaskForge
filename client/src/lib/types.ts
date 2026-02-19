// ─── Primitive Types ──────────────────────────────────────────────────────────

export type Priority = "Urgent" | "High" | "Medium" | "Low" | "Completed";

export type TaskStatus = "Backlog" | "In Progress" | "In Review" | "Completed";

export type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "Completed";

export type ColumnId = "todo" | "inprogress" | "review" | "done";

// ─── Entity Interfaces ────────────────────────────────────────────────────────

export interface Assignee {
  name: string;
  initials: string;
  image?: string;
}

export interface Objective {
  title: string;
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  type?: string;
  dueDate?: string;
  image?: string;
  assignee?: Assignee | null;
  tags?: string[];
  objectives?: Objective[];
  estimate?: string;
  description?: string;
  status?: string; // freeform status label (e.g. "2/3 approvals")
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  dotColor: string;
  tasks: Task[];
}

export interface Project {
  id: number;
  name: string;
  manager: string;
  date: string;
  status: ProjectStatus;
  team: string[];
  progress: number;
  color: string;
}

// ─── Form Value Types (inferred from Zod schemas in schemas.ts) ───────────────
// Re-exported from schemas.ts for convenience — see that file for definitions.
export type {
  LoginFormValues,
  SignupFormValues,
  ProjectFormValues,
  TaskFormValues,
} from "./schemas";
