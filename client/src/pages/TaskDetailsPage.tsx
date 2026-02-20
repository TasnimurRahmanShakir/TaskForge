import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MessageSquare,
  Activity,
  ChevronLeft,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Circle,
  Tag as TagIcon,
  User as UserIcon,
  Timer,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TaskDiscussion } from "@/components/dashboard/task/TaskDiscussion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskForm } from "@/components/dashboard/TaskForm";
import type { Task, ActivityLog } from "@/lib/types";

type ViewSection = "overview" | "discussion" | "activity";

export default function TaskDetailsPage() {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [activeSection, setActiveSection] = useState<ViewSection>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ task: Task }>(`/tasks/${taskId}`);
      setTask(res.task);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    BACKLOG: "bg-white/5 text-white/50 border-white/10",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_REVIEW: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const priorityColors: Record<string, string> = {
    URGENT: "bg-red-500/10 text-red-500 border-red-500/20",
    HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    MEDIUM: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    );

  if (!task)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
          <div className="h-20 w-20 rounded-3xl bg-white/3 flex items-center justify-center border border-white/5 border-dashed mb-2">
            <Plus className="h-10 w-10 text-white/10 rotate-45" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Task not found
            </h2>
            <p className="text-white/40 text-sm max-w-xs">
              The task you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-8"
          >
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 pb-32">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projects/${projectId}`)}
            className="text-white/40 hover:text-white hover:bg-white/5 -ml-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Board
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/40 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsEditOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-6"
            >
              Edit Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Project & Title & Status */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {task.project?.name || "Project"}
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.95]">
                  {task.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  className={cn(
                    "px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase",
                    statusColors[task.status],
                  )}
                >
                  {task.status.replace("_", " ")}
                </Badge>
                <Badge
                  className={cn(
                    "px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase",
                    priorityColors[task.priority],
                  )}
                >
                  {task.priority} Priority
                </Badge>
              </div>

              <div className="p-1 pb-0">
                <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium max-w-2xl">
                  {task.description || "No description provided for this task."}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl w-fit">
              <NavButton
                active={activeSection === "overview"}
                onClick={() => setActiveSection("overview")}
                icon={<Clock className="w-4 h-4" />}
                label="Overview"
              />
              <NavButton
                active={activeSection === "discussion"}
                onClick={() => setActiveSection("discussion")}
                icon={<MessageSquare className="w-4 h-4" />}
                label="Discussion"
              />
              <NavButton
                active={activeSection === "activity"}
                onClick={() => setActiveSection("activity")}
                icon={<Activity className="w-4 h-4" />}
                label="Activity"
              />
            </div>

            {/* Section Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeSection === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    {/* Checklist */}
                    <div className="glass-morphism rounded-3xl p-8 border border-white/5">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">
                          Checklist
                        </h3>
                        <span className="text-sm font-bold text-primary">
                          {
                            task.checklistItems.filter((i) => i.completed)
                              .length
                          }
                          /{task.checklistItems.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {task.checklistItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-all"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-white/20 group-hover:text-white/40" />
                            )}
                            <span
                              className={cn(
                                "text-white/80 font-medium",
                                item.completed && "text-white/30 line-through",
                              )}
                            >
                              {item.title}
                            </span>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary hover:text-primary hover:bg-primary/5 rounded-2xl h-14 font-bold border-2 border-dashed border-primary/20 mt-2"
                        >
                          <Plus className="w-5 h-5 mr-3" />
                          Add Task Item
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-white/40 flex items-center">
                        <TagIcon className="w-4 h-4 mr-2" />
                        Task Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-4 py-2 bg-white/5 text-white/70 rounded-xl text-sm font-semibold border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSection === "discussion" && (
                  <motion.div
                    key="discussion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <TaskDiscussion task={task} />
                  </motion.div>
                )}

                {activeSection === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-6">
                      Activity Timeline
                    </h3>
                    <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[px] before:bg-white/5">
                      {task.activityLogs.map((log: ActivityLog) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-4 relative"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-[#0d0d1a] border border-white/5 flex items-center justify-center z-10">
                            <Activity className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-white font-medium">
                              {log.description}
                            </p>
                            <p className="text-xs text-white/30 mt-1 font-bold">
                              {new Date(log.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Assignees */}
            <div className="glass-morphism rounded-3xl p-8 border border-white/5 space-y-6">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center">
                <UserIcon className="w-4 h-4 mr-2" />
                Assignees
              </h3>
              <div className="space-y-4">
                {task.assignees.map((assignee) => (
                  <div
                    key={assignee.user.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <Avatar className="w-10 h-10 border-2 border-white/10">
                      <AvatarImage src={assignee.user.profileImage || ""} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                        {assignee.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 truncate">
                      <p className="text-white text-sm font-bold truncate">
                        {assignee.user.name}
                      </p>
                      <p className="text-[10px] text-white/30 uppercase tracking-tighter font-black">
                        Full Member
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl py-6 border border-dashed border-white/10"
                >
                  Manage Team
                </Button>
              </div>
            </div>

            {/* Meta Details */}
            <div className="glass-morphism rounded-3xl p-8 border border-white/5 space-y-8">
              <MetaItem
                icon={<Calendar className="w-5 h-5 text-primary" />}
                label="Due Date"
                value={
                  task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No deadline"
                }
              />
              <MetaItem
                icon={<Timer className="w-5 h-5 text-orange-400" />}
                label="Estimate"
                value={task.estimate || "Not estimated"}
              />
              <div className="pt-4 border-top border-white/5">
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] text-center">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none overflow-hidden sm:rounded-3xl shadow-2xl">
          <TaskForm
            initialData={task}
            projectId={projectId}
            onSuccess={() => {
              setIsEditOpen(false);
              fetchTask();
            }}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "rounded-xl px-6 py-2 h-10 font-bold transition-all text-sm",
        active
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "text-white/40 hover:text-white hover:bg-white/5",
      )}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-white font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
