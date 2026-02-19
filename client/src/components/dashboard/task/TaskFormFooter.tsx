import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskFormFooterProps {
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function TaskFormFooter({
  isLoading,
  isEditing,
  onCancel,
}: TaskFormFooterProps) {
  return (
    <div className="px-4 sm:px-6 py-4 border-t border-white/6 flex items-center justify-between gap-3 shrink-0 bg-[#080812]">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="text-white/40 hover:text-white hover:bg-white/6 font-medium text-sm h-10 px-4 rounded-xl transition-all"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 px-6 sm:px-8 rounded-xl shadow-[0_0_20px_-5px_var(--color-primary)] transition-all flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            <span>{isEditing ? "Save Changes" : "Create Task"}</span>
          </>
        )}
      </Button>
    </div>
  );
}
