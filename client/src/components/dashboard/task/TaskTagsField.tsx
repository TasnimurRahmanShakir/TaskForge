import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Tag as TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SUGGESTED_TAGS = [
  "Design",
  "Frontend",
  "Backend",
  "Marketing",
  "Q3",
  "Strategy",
  "Bug",
  "Feature",
];

interface TaskTagsFieldProps {
  tags?: string[];
  onChange: (tags: string[]) => void;
}

export function TaskTagsField({ tags = [], onChange }: TaskTagsFieldProps) {
  const [newTag, setNewTag] = useState("");

  const addTag = (tag?: string) => {
    const t = (tag ?? newTag).trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setNewTag("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="space-y-3">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {tags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
              >
                <Badge
                  variant="secondary"
                  className="h-7 bg-primary/15 text-primary border border-primary/25 text-[10px] font-bold px-2.5 rounded-lg gap-1.5 hover:bg-primary/20 transition-colors"
                >
                  <TagIcon className="h-2.5 w-2.5 shrink-0" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-0.5 hover:text-red-400 transition-colors"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type a tag and press Enter..."
            className="w-full h-10 bg-white/3 border border-white/10 focus:border-primary/50 focus:bg-white/5 transition-all rounded-xl text-xs text-white placeholder:text-white/25 pl-8 pr-3 focus:outline-none"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addTag()}
          aria-label="Add tag"
          className="h-10 px-3 bg-white/3 border-white/10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary rounded-xl transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => addTag(t)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/3 border border-white/6 text-white/35 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all"
            >
              + {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
