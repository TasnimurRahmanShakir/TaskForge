import { Calendar, MoreVertical, Edit2, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { id, name, manager, date, status, team, progress, color } = project;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass-morphism rounded-2xl p-6 border border-white/5 group h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform",
            color,
          )}
        >
          <Calendar className="h-6 w-6" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-[#0d0d1a] border-white/10"
            align="end"
          >
            <DropdownMenuItem
              className="text-muted-foreground focus:text-white focus:bg-white/5 cursor-pointer gap-2"
              onClick={() => navigate(`/projects/edit/${id}`)}
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-red-400/10 cursor-pointer gap-2">
              <Trash2 className="h-3.5 w-3.5" /> Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight truncate group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Started on {date}
        </p>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border border-white/10">
              <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                {manager
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-white/80">{manager}</span>
          </div>
          <Badge
            variant={
              status === "On Track"
                ? "success"
                : status === "At Risk"
                  ? "destructive"
                  : "info"
            }
            className="rounded-lg text-[9px] uppercase font-black tracking-widest px-2 py-0.5"
          >
            {status}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
            <span>Progress</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                progress > 70
                  ? "bg-emerald-500"
                  : progress > 30
                    ? "bg-primary"
                    : "bg-amber-500",
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {team.map((member, i) => (
            <Avatar
              key={i}
              className="h-7 w-7 border-2 border-[#0d0d1a] hover:z-10 transition-all cursor-pointer"
            >
              <AvatarFallback className="bg-white/5 text-[10px] text-muted-foreground">
                {member}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="h-7 w-7 rounded-full bg-white/5 border-2 border-[#0d0d1a] flex items-center justify-center text-[10px] text-muted-foreground font-bold">
            +3
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs font-bold text-primary hover:text-white gap-1 p-0 px-2 h-8"
          onClick={() => navigate(`/projects/${id}`)}
        >
          Details <Users className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
}
