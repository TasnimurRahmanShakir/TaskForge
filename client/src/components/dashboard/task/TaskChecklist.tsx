import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Objective } from "@/lib/types";
import { api } from "@/lib/api";

interface TaskChecklistProps {
  taskId?: string | number;
  objectives?: Objective[];
  onChange: (objectives: Objective[]) => void;
}

export function TaskChecklist({
  taskId,
  objectives = [],
  onChange,
}: TaskChecklistProps) {
  const [newItem, setNewItem] = useState("");

  const completed = objectives.filter((o) => o.completed).length;
  const total = objectives.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange([...objectives, { title: newItem.trim(), completed: false }]);
    setNewItem("");
  };

  const toggleItem = async (i: number) => {
    const item = objectives[i];
    const updated = [...objectives];
    const newStatus = !item.completed;
    updated[i] = { ...item, completed: newStatus };

    // Optimistic update
    onChange(updated);

    // If item has an ID and we have a taskId, sync immediately
    if (item.id && taskId) {
      try {
        await api.patch(`/tasks/${taskId}/checklist/${item.id}/toggle`);
      } catch (error) {
        console.error("Error toggling checklist item:", error);
        // Rollback on error
        const rolledBack = [...objectives];
        rolledBack[i] = { ...item, completed: !newStatus };
        onChange(rolledBack);
      }
    }
  };

  const removeItem = (i: number) =>
    onChange(objectives.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      {total > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>
              {completed} of {total} completed
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {objectives.map((obj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 group p-3 rounded-xl bg-white/2 border border-white/6 hover:border-white/10 transition-all"
            >
              <button
                type="button"
                onClick={() => toggleItem(i)}
                aria-label={obj.completed ? "Mark incomplete" : "Mark complete"}
                className={cn(
                  "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                  obj.completed
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-white/20 hover:border-primary/60",
                )}
              >
                {obj.completed && <Check className="h-3 w-3 stroke-3" />}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm font-medium transition-all",
                  obj.completed
                    ? "line-through text-white/25"
                    : "text-white/85",
                )}
              >
                {obj.title}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Remove item"
                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {total === 0 && (
          <p className="text-center py-8 text-white/20 text-sm">
            No deliverables yet. Add one below.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add a deliverable or milestone..."
          className="h-11 bg-white/3 border-white/10 focus:border-primary/50 focus:bg-white/5 transition-all rounded-xl text-sm text-white placeholder:text-white/25"
        />
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          aria-label="Add item"
          className="h-11 px-4 bg-white/3 border-white/10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary rounded-xl transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
