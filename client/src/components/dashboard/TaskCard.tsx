import {
  Calendar,
  MoreHorizontal,
  AlertCircle,
  ArrowRight,
  CheckCheck,
  PlayCircle,
  Send,
  Eye,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Task, ColumnId } from "@/lib/types";

interface WorkflowStep {
  label: string;
  icon: LucideIcon;
  next: ColumnId;
  color: string;
}

const WORKFLOW: Partial<Record<ColumnId, WorkflowStep>> = {
  todo: {
    label: "Accept",
    icon: PlayCircle,
    next: "inprogress",
    color:
      "text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-500/50",
  },
  inprogress: {
    label: "Submit for Review",
    icon: Send,
    next: "review",
    color:
      "text-purple-400 border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 hover:border-purple-500/50",
  },
  review: {
    label: "Verify & Complete",
    icon: CheckCheck,
    next: "done",
    color:
      "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/50",
  },
};

const priorityColors: Record<string, string> = {
  Urgent: "bg-red-500/10 text-red-500 border-red-500/20",
  High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

interface TaskCardProps {
  task: Task;
  columnId: ColumnId;
  onClick?: () => void;
  onStatusChange?: (
    taskId: number,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
  ) => void;
  onDelete?: (taskId: number, columnId: ColumnId) => void;
}

export function TaskCard({
  task,
  columnId,
  onClick,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const { title, priority, tags, dueDate, assignee, image, type } = task;
  const action = WORKFLOW[columnId];

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (action) onStatusChange?.(task.id, columnId, action.next);
  };

  return (
    <div className="group bg-[#1a1a2e]/40 backdrop-blur-md border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/5 select-none">
      {/* Priority + ··· Menu */}
      <div className="flex justify-between items-start mb-3">
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-lg",
            priorityColors[priority] || "border-white/10 text-muted-foreground",
          )}
        >
          {priority}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-white p-0.5 rounded-md hover:bg-white/5 transition-all"
              aria-label="Task options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#0d0d1a] border-white/10 rounded-xl w-40 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              className="gap-2.5 py-2 cursor-pointer text-white/70 hover:text-white focus:bg-white/5 focus:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              <Eye className="h-3.5 w-3.5 text-white/40" />
              <span className="text-sm font-medium">Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2.5 py-2 cursor-pointer text-white/70 hover:text-white focus:bg-white/5 focus:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              <Pencil className="h-3.5 w-3.5 text-white/40" />
              <span className="text-sm font-medium">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/6" />
            <DropdownMenuItem
              className="gap-2.5 py-2 cursor-pointer text-red-400/80 focus:bg-red-500/10 focus:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(task.id, columnId);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-snug mb-2">
        {title}
      </h4>
      {type && (
        <p className="text-[10px] text-muted-foreground font-medium mb-3">
          {type}
        </p>
      )}

      {image && (
        <div className="relative h-28 w-full rounded-lg overflow-hidden mb-4 border border-white/5">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground/60 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {action && (
        <button
          onClick={handleAction}
          className={cn(
            "w-full mt-3 mb-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all",
            action.color,
          )}
        >
          <action.icon className="h-3 w-3" />
          {action.label}
          <ArrowRight className="h-3 w-3 ml-0.5" />
        </button>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div
          className={cn(
            "flex items-center gap-1 text-[10px] font-bold",
            dueDate === "Tomorrow"
              ? "text-orange-400"
              : "text-muted-foreground/50",
          )}
        >
          {dueDate === "Tomorrow" ? (
            <AlertCircle className="h-3 w-3" />
          ) : (
            <Calendar className="h-3 w-3" />
          )}
          <span>{dueDate}</span>
        </div>
        {assignee && (
          <Avatar className="h-6 w-6 border border-white/10 ring-2 ring-[#0d0d1a]">
            <AvatarImage src={assignee.image} />
            <AvatarFallback className="text-[8px] bg-primary/20 text-primary">
              {assignee.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
