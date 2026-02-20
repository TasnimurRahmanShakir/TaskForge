import {
  Search,
  Share2,
  Plus,
  UserPlus,
  Calendar,
  Tag,
  LayoutGrid,
  Square,
  Loader2,
  User as UserIcon,
  ClipboardList,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/dashboard/TaskForm";
import { HasPermission } from "@/components/auth/HasPermission";
import { ProjectActivity } from "@/components/dashboard/project/ProjectActivity";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type {
  KanbanColumn,
  Task,
  ColumnId,
  Project,
  ProjectStatus,
} from "@/lib/types";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/media";

const INITIAL_BOARD: KanbanColumn[] = [
  // ... (keeping INITIAL_BOARD for now, will replace with real task fetching soon)
];

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [boardData, setBoardData] = useState<KanbanColumn[]>([
    { id: "todo", title: "To Do", dotColor: "bg-primary", tasks: [] },
    {
      id: "inprogress",
      title: "In Progress",
      dotColor: "bg-blue-500",
      tasks: [],
    },
    { id: "review", title: "Review", dotColor: "bg-purple-500", tasks: [] },
    { id: "done", title: "Done", dotColor: "bg-emerald-500", tasks: [] },
  ]);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "activity">("board");

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const projData = await api.get<{ project: Project }>(
        `/projects/search?query=${id}`,
      );
      setProject(projData.project);

      const taskData = await api.get<{ tasks: any[] }>(
        `/tasks?projectId=${projData.project.id}`,
      );

      // Group tasks by status
      const groupedTasks: Record<string, Task[]> = {
        todo: [],
        inprogress: [],
        review: [],
        done: [],
      };

      taskData.tasks.forEach((t) => {
        const mappedTask: Task = {
          id: t.id,
          projectId: t.projectId,
          title: t.title,
          priority: t.priority,
          status: t.status,
          dueDate: t.dueDate
            ? new Date(t.dueDate).toLocaleDateString()
            : undefined,
          description: t.description,
          image: t.image,
          tags: t.tags,
          assignees: t.assignees,
          checklistItems: t.checklistItems,
          activityLogs: t.activityLogs || [],
          createdAt: t.createdAt,
        };

        const statusKey = t.status.toLowerCase().replace("_", "");
        if (groupedTasks[statusKey]) {
          groupedTasks[statusKey].push(mappedTask);
        } else if (t.status === "BACKLOG") {
          groupedTasks["todo"].push(mappedTask);
        }
      });

      setBoardData((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: groupedTasks[col.id] || [],
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectAndTasks();
  }, [id]);

  const handleStatusChange = (
    taskId: string | number,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
  ) => {
    setBoardData((prev) => {
      const fromCol = prev.find((c) => c.id === fromColumnId);
      const task = fromCol?.tasks.find((t) => t.id === taskId);
      if (!task) return prev;
      return prev.map((col) => {
        if (col.id === fromColumnId)
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        if (col.id === toColumnId)
          return { ...col, tasks: [...col.tasks, task] };
        return col;
      });
    });
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskOpen(true);
  };

  const handleDelete = (taskId: string | number, columnId: ColumnId) => {
    setBoardData((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col,
      ),
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-black text-white">Project Not Found</h2>
          <p className="text-muted-foreground">
            The project you are looking for does not exist.
          </p>
          <Button
            onClick={() => navigate("/projects")}
            variant="outline"
            className="rounded-xl"
          >
            Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout mainClassName="h-full overflow-hidden">
      <div className="h-full flex flex-col space-y-4 sm:space-y-6 w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
              <span className="hidden xs:inline">Projects</span>
              <span className="hidden xs:inline">/</span>
              <span className="text-white/80">{project.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {project.name}
            </h1>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            <div className="flex -space-x-1.5 sm:-space-x-2 shrink-0">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-[#0d0d1a]">
                {project.manager.profileImage ? (
                  <AvatarImage
                    src={getImageUrl(project.manager.profileImage)}
                    alt={project.manager.name}
                  />
                ) : (
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              {project.members?.slice(0, 2).map((member, i) => (
                <Avatar
                  key={i}
                  className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-[#0d0d1a]"
                >
                  {member.user.profileImage ? (
                    <AvatarImage
                      src={getImageUrl(member.user.profileImage)}
                      alt={member.user.name}
                    />
                  ) : (
                    <AvatarFallback className="bg-white/10 text-muted-foreground uppercase">
                      <UserIcon className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
              {project.members && project.members.length > 2 && (
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-[#0d0d1a]">
                  <AvatarFallback className="bg-white/10 text-muted-foreground text-[9px] sm:text-[10px] font-bold">
                    +{project.members.length - 2}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex items-center gap-2">
              <HasPermission roles={["SUPER_USER", "PROJECT_MANAGER"]}>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/projects/${id}/team`)}
                  className="h-9 sm:h-10 px-3 sm:px-4 border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-[10px] sm:text-xs gap-1.5 sm:gap-2"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Team</span>
                </Button>
              </HasPermission>
              <Button
                variant="outline"
                className="h-9 sm:h-10 px-3 sm:px-4 border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-[10px] sm:text-xs gap-1.5 sm:gap-2"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <HasPermission
                roles={["SUPER_USER", "PROJECT_MANAGER", "MEMBER"]}
              >
                {/* Note: ProjectRole.LEADER check should be implemented if we have project context */}
                <Button
                  onClick={handleAddTask}
                  className="h-9 sm:h-10 px-3 sm:px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl text-[10px] sm:text-xs shadow-[0_0_20px_-8px_var(--color-primary)]"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Task</span>
                  <span className="sm:hidden">Task</span>
                </Button>
              </HasPermission>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 bg-white/2 border border-white/5 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
          <div className="relative group w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search tasks..."
              className="h-9 sm:h-10 pl-9 sm:pl-10 bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl w-full text-[10px] sm:text-xs"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-white/3 p-1 rounded-xl mr-2">
              <Button
                variant="ghost"
                onClick={() => setViewMode("board")}
                className={cn(
                  "h-8 px-3 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all",
                  viewMode === "board"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-white/40 hover:text-white hover:bg-white/5",
                )}
              >
                Board
              </Button>
              <Button
                variant="ghost"
                onClick={() => setViewMode("activity")}
                className={cn(
                  "h-8 px-3 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all",
                  viewMode === "activity"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-white/40 hover:text-white hover:bg-white/5",
                )}
              >
                Activity
              </Button>
            </div>

            <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

            <Button
              variant="ghost"
              className="h-8 sm:h-9 px-2 sm:px-3 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl text-[9px] sm:text-xs gap-1.5 sm:gap-2 font-bold uppercase tracking-wider"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Assignee</span>
            </Button>
            <Button
              variant="ghost"
              className="h-8 sm:h-9 px-2 sm:px-3 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl text-[9px] sm:text-xs gap-1.5 sm:gap-2 font-bold uppercase tracking-wider"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Due Date</span>
            </Button>
            <Button
              variant="ghost"
              className="h-8 sm:h-9 px-2 sm:px-3 text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl text-[9px] sm:text-xs gap-1.5 sm:gap-2 font-bold uppercase tracking-wider"
            >
              <Tag className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Tags</span>
            </Button>
            <div className="h-4 w-px bg-white/5 mx-1 hidden sm:block" />
            <div className="flex bg-white/5 p-1 rounded-xl">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-white rounded-lg"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-primary text-primary-foreground rounded-lg shadow-sm"
              >
                <Square className="h-3.5 w-3.5 rotate-90" />
              </Button>
            </div>
          </div>
        </div>

        {/* Board or Activity View */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-6 px-6 pb-20">
          <AnimatePresence mode="wait">
            {viewMode === "board" ? (
              <motion.div
                key="board"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {boardData.some((col) => col.tasks.length > 0) ? (
                  <KanbanBoard
                    columns={boardData}
                    onTaskClick={handleEditTask}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white/5 p-4 rounded-full ring-1 ring-white/10">
                      <ClipboardList className="h-8 w-8 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-white">
                        No task available now
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        There are no tasks in this project yet. Create a new
                        task to get started.
                      </p>
                    </div>
                    <HasPermission
                      roles={["SUPER_USER", "PROJECT_MANAGER", "MEMBER"]}
                    >
                      <Button
                        onClick={handleAddTask}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Task
                      </Button>
                    </HasPermission>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto"
              >
                <ProjectActivity projectId={id!} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden border-white/6 bg-[#080812] gap-0 h-[90vh] max-h-[90vh] flex flex-col [&>button:last-child]:hidden">
          <DialogTitle className="sr-only">
            {selectedTask ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the details for your task.
          </DialogDescription>
          {project && (
            <TaskForm
              initialData={selectedTask ?? undefined}
              projectName={project.name}
              projectId={project.id}
              onSuccess={() => {
                setIsTaskOpen(false);
                fetchProjectAndTasks();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
