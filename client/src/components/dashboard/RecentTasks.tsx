import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentTask {
  id: number;
  title: string;
  project: string;
  status: string;
  priority: string;
  dueDate: string;
  icon: LucideIcon;
  color: string;
}

const tasks: RecentTask[] = [
  {
    id: 1,
    title: "Q3 Marketing Plan",
    project: "Marketing",
    status: "In Progress",
    priority: "High",
    dueDate: "Today",
    icon: CheckCircle2,
    color: "text-primary",
  },
  {
    id: 2,
    title: "Fix API Latency",
    project: "Engineering",
    status: "High Priority",
    priority: "Critical",
    dueDate: "Tomorrow",
    icon: Clock,
    color: "text-red-400",
  },
  {
    id: 3,
    title: "Onboard Designer",
    project: "Design",
    status: "Completed",
    priority: "Medium",
    dueDate: "Friday",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    id: 4,
    title: "Update Legal Docs",
    project: "Legal",
    status: "Pending",
    priority: "Low",
    dueDate: "Overdue",
    icon: Circle,
    color: "text-amber-500",
  },
  {
    id: 5,
    title: "QA Mobile App",
    project: "QA Team",
    status: "In Progress",
    priority: "High",
    dueDate: "Oct 24",
    icon: Clock,
    color: "text-primary",
  },
];

export function RecentTasks() {
  return (
    <div className="glass-morphism rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Recent Tasks
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-white text-xs font-bold uppercase transition-colors"
        >
          View All
        </Button>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/3 transition-all border border-transparent hover:border-white/5"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-10 w-10 min-w-[40px] rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform",
                  task.color,
                )}
              >
                <task.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {task.title}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {task.project} • Due {task.dueDate}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <Badge
                  variant={
                    task.status === "Completed"
                      ? "success"
                      : task.status === "High Priority"
                        ? "destructive"
                        : task.status === "Pending"
                          ? "secondary"
                          : "info"
                  }
                  className="rounded-lg text-[10px] uppercase font-bold tracking-widest px-2 py-0.5"
                >
                  {task.status}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
