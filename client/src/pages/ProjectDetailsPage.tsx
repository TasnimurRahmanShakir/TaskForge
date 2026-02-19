import {
  Search,
  Share2,
  Plus,
  UserPlus,
  Calendar,
  Tag,
  LayoutGrid,
  Square,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskForm } from "@/components/dashboard/TaskForm";
import { PROJECTS_DATA } from "@/lib/constants";
import type { KanbanColumn, Task, ColumnId } from "@/lib/types";

const INITIAL_BOARD: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    dotColor: "bg-primary",
    tasks: [
      {
        id: 1,
        title: "Draft Campaign Brief for Q4",
        priority: "High",
        type: "Strategy",
        dueDate: "Oct 24",
        assignee: { name: "John Doe", initials: "JD", image: "" },
      },
      {
        id: 2,
        title: "Competitor Analysis Report",
        priority: "Medium",
        type: "Research",
        dueDate: "Oct 26",
        assignee: { name: "Alex Morgan", initials: "AM", image: "" },
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    dotColor: "bg-blue-500",
    tasks: [
      {
        id: 3,
        title: "Design Hero Assets for Landing Page",
        priority: "Urgent",
        type: "Design • UI/UX",
        dueDate: "Tomorrow",
        image:
          "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400",
        assignee: { name: "Sarah Konor", initials: "SK", image: "" },
      },
      {
        id: 4,
        title: "Copywriting for About Us Page",
        priority: "Low",
        type: "Content",
        dueDate: "Oct 30",
        assignee: { name: "Elena Morgan", initials: "EM", image: "" },
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    dotColor: "bg-purple-500",
    tasks: [
      {
        id: 5,
        title: "Legal Approval for Terms",
        priority: "Medium",
        type: "Legal",
        dueDate: "Oct 22",
        assignee: { name: "John Doe", initials: "JD", image: "" },
      },
      {
        id: 6,
        title: "QA Testing: Sign-up Flow",
        priority: "High",
        type: "QA • Bug Fix",
        dueDate: "Oct 25",
        assignee: { name: "Chris Evans", initials: "CE", image: "" },
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    dotColor: "bg-emerald-500",
    tasks: [
      {
        id: 7,
        title: "Project Kickoff Meeting",
        priority: "Completed",
        type: "Admin",
        dueDate: "Oct 15",
        assignee: { name: "Rachel Lee", initials: "RL", image: "" },
      },
      {
        id: 8,
        title: "Set Up Analytics Dashboard",
        priority: "Completed",
        type: "Tech",
        dueDate: "Oct 18",
        assignee: { name: "Alex Morgan", initials: "AM", image: "" },
      },
    ],
  },
];

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = PROJECTS_DATA.find((p) => p.id === parseInt(id ?? ""));

  const [boardData, setBoardData] = useState<KanbanColumn[]>(INITIAL_BOARD);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Partial<Task> | null>(null);

  const handleStatusChange = (
    taskId: number,
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

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsTaskOpen(true);
  };
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskOpen(true);
  };
  const handleDelete = (taskId: number, columnId: ColumnId) => {
    setBoardData((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col,
      ),
    );
  };

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
                <AvatarFallback className="bg-primary/20 text-primary text-[9px] sm:text-[10px] font-bold">
                  {project.manager
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {project.team.slice(0, 2).map((member, i) => (
                <Avatar
                  key={i}
                  className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-[#0d0d1a]"
                >
                  <AvatarFallback className="bg-white/10 text-muted-foreground text-[9px] sm:text-[10px] font-bold">
                    {member}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.team.length > 2 && (
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-[#0d0d1a]">
                  <AvatarFallback className="bg-white/10 text-muted-foreground text-[9px] sm:text-[10px] font-bold">
                    +{project.team.length - 2}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/projects/${id}/team`)}
                className="h-9 sm:h-10 px-3 sm:px-4 border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-[10px] sm:text-xs gap-1.5 sm:gap-2"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Team</span>
              </Button>
              <Button
                variant="outline"
                className="h-9 sm:h-10 px-3 sm:px-4 border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-[10px] sm:text-xs gap-1.5 sm:gap-2"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                onClick={handleAddTask}
                className="h-9 sm:h-10 px-3 sm:px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl text-[10px] sm:text-xs shadow-[0_0_20px_-8px_var(--color-primary)]"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Task</span>
              </Button>
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

        {/* Board */}
        <KanbanBoard
          columns={boardData}
          onTaskClick={handleEditTask}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden border-white/6 bg-[#080812] gap-0 h-[90vh] max-h-[90vh] flex flex-col [&>button:last-child]:hidden">
          <TaskForm
            initialData={selectedTask ?? undefined}
            projectName={project.name}
            onSuccess={() => setIsTaskOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
