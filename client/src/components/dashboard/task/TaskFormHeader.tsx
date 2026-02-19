import { X, ChevronRight } from "lucide-react";

interface TaskFormHeaderProps {
  projectName: string;
  isEditing: boolean;
  onClose: () => void;
}

export function TaskFormHeader({
  projectName,
  isEditing,
  onClose,
}: TaskFormHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/6 shrink-0">
      <div className="flex items-center gap-1.5 sm:gap-2 text-sm min-w-0">
        <span className="text-white/40 font-medium truncate max-w-[120px] sm:max-w-none">
          {projectName}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-white/15 shrink-0" />
        <span className="text-white font-semibold truncate">
          {isEditing ? "Edit Task" : "New Task"}
        </span>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="h-8 w-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/6 transition-all shrink-0 ml-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
