// ─── Primitive Types ──────────────────────────────────────────────────────────

export type Priority = "Urgent" | "High" | "Medium" | "Low" | "Completed";

export type TaskStatus = "Backlog" | "In Progress" | "In Review" | "Completed";

export type ProjectStatus = "On Track" | "At Risk" | "Delayed" | "Completed";

export type ColumnId = "todo" | "inprogress" | "review" | "done";

// ─── Entity Interfaces ────────────────────────────────────────────────────────

export interface Assignee {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface Objective {
  id?: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  priority: string;
  status: string;
  dueDate?: string;
  image?: string;
  tags: string[];
  assignees: Assignee[];
  checklistItems: Objective[];
  activityLogs: ActivityLog[];
  estimate?: string;
  description?: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  };
  comments?: Comment[];
}

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  dotColor: string;
  tasks: Task[];
}

export interface ProjectManager {
  id: string;
  name: string;
  profileImage?: string;
}

export interface ProjectMember {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  manager: ProjectManager;
  teamLeaderId?: string | null;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  memberIds?: string[];
  members?: ProjectMember[];
  progress: number;
  color: string;
  tags?: string[];
}

// ─── Form Value Types (inferred from Zod schemas in schemas.ts) ───────────────
// Re-exported from schemas.ts for convenience — see that file for definitions.
export type {
  LoginFormValues,
  SignupFormValues,
  ProjectFormValues,
  TaskFormValues,
} from "./schemas";
