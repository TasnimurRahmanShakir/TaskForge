import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { KanbanColumn } from "./KanbanColumn";
import type {
  KanbanColumn as KanbanColumnType,
  Task,
  ColumnId,
} from "@/lib/types";

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onTaskClick: (task: Task) => void;
  onStatusChange: (
    taskId: string | number,
    fromColumnId: ColumnId,
    toColumnId: ColumnId,
  ) => void;
  onDelete: (taskId: string | number, columnId: ColumnId) => void;
}

export function KanbanBoard({
  columns,
  onTaskClick,
  onStatusChange,
  onDelete,
}: KanbanBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    if (!containerRef.current || !boardRef.current) return;
    const updateConstraints = () => {
      const containerWidth = containerRef.current!.offsetWidth;
      const boardWidth = boardRef.current!.scrollWidth;
      const left = Math.min(0, containerWidth - boardWidth - 48);
      setConstraints({ left, right: 0 });
    };
    const resizeObserver = new ResizeObserver(updateConstraints);
    resizeObserver.observe(containerRef.current);
    resizeObserver.observe(boardRef.current);
    updateConstraints();
    return () => resizeObserver.disconnect();
  }, [columns]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden relative select-none"
    >
      <motion.div
        ref={boardRef}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.05}
        dragTransition={{ power: 0.1, timeConstant: 200 }}
        className="flex gap-6 px-4 cursor-grab active:cursor-grabbing h-full"
        style={{ width: "fit-content" }}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            count={column.tasks.length}
            tasks={column.tasks}
            dotColor={column.dotColor}
            columnId={column.id}
            onTaskClick={onTaskClick}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
        <div className="w-[280px] sm:w-[350px] shrink-0 h-full flex flex-col pt-1">
          <div className="flex items-center justify-between mb-4 px-2 opacity-0 pointer-events-none">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/90">
              Spacer
            </h3>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/5 text-muted-foreground/40 hover:text-white/60 hover:border-white/20 transition-all font-bold text-xs uppercase tracking-widest bg-white/2">
            <Plus className="h-4 w-4" /> Add Column
          </button>
        </div>
      </motion.div>
    </div>
  );
}
