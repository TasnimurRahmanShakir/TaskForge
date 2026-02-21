import { MoreHorizontal, Plus } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HasPermission } from "@/components/auth/HasPermission";
import type { Task, ColumnId } from "@/lib/types";

interface KanbanColumnProps {
  title: string;
  count: number;
  tasks: Task[];
  dotColor: string;
  columnId: ColumnId;
  onTaskClick: (task: Task) => void;
  onStatusChange: (
    taskId: string | number,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
  ) => void;
  onDelete: (taskId: string | number, columnId: ColumnId) => void;
  isManagerOrLeader?: boolean;
}

export function KanbanColumn({
  title,
  count,
  tasks,
  dotColor,
  columnId,
  onTaskClick,
  onStatusChange,
  onDelete,
  isManagerOrLeader,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col w-[280px] sm:w-[350px] shrink-0 h-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", dotColor)} />
          <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.15em]">
            {title}
          </h3>
          <span className="bg-white/5 text-muted-foreground/40 text-[10px] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full font-bold">
            {count}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="flex-1 -mx-2">
        <div className="space-y-3 px-2 pb-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={columnId}
              onClick={() => onTaskClick(task)}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              isManagerOrLeader={isManagerOrLeader}
            />
          ))}
          <HasPermission roles={["SUPER_USER", "PROJECT_MANAGER", "MEMBER"]}>
            <button
              onClick={() =>
                onTaskClick({
                  id: "0",
                  title: "",
                  priority: "Medium",
                  status: "BACKLOG",
                  tags: [],
                  assignees: [],
                  checklistItems: [],
                  activityLogs: [],
                  createdAt: new Date().toISOString(),
                  projectId: "",
                })
              }
              className="w-full py-3 h-12 rounded-xl border border-dashed border-white/5 text-muted-foreground/30 hover:text-white/60 hover:border-white/20 transition-all font-bold text-xs flex items-center justify-center gap-2 group"
            >
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />{" "}
              Add Task
            </button>
          </HasPermission>
        </div>
      </ScrollArea>
    </div>
  );
}
