import { useState, useEffect } from "react";
import {
  Activity,
  Loader2,
  User as UserIcon,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActivityLog {
  id: string;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  task?: {
    id: string;
    title: string;
  };
}

interface ProjectActivityProps {
  projectId: string;
}

export function ProjectActivity({ projectId }: ProjectActivityProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [projectId]);

  const fetchActivity = async () => {
    try {
      setIsLoading(true);
      const res = (await api.get(`/projects/${projectId}/activity`)) as any;
      setActivities(res.data.activity);
    } catch (error) {
      console.error("Error fetching project activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-white/40 animate-pulse uppercase tracking-widest">
          Fetching Project History...
        </p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center space-y-6 glass-morphism rounded-[40px] border border-white/5">
        <div className="h-20 w-20 rounded-[30px] bg-white/3 flex items-center justify-center border border-white/5 border-dashed">
          <Activity className="h-10 w-10 text-white/10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">No activity yet</h3>
          <p className="text-sm text-white/30 max-w-sm">
            Everything is quiet. Activity logs will appear here as the team
            makes progress on tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-white tracking-tight">
          Project Activity
        </h2>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          Total {activities.length} Entries
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex gap-5 p-5 bg-white/2 hover:bg-white/4 border border-white/5 rounded-3xl transition-all duration-500"
          >
            <Avatar className="h-12 w-12 shrink-0 border border-white/10 shadow-2xl">
              <AvatarImage src={getImageUrl(log.user.profileImage)} />
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-black">
                {log.user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {log.user.name}
                  </span>
                  <span className="text-xs text-white/40 font-medium">
                    {log.description}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20">
                    <Clock className="h-3 w-3" />
                    {new Date(log.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-white/30 truncate max-w-[100px]">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {log.task && (
                <div className="flex items-center gap-3">
                  <div className="h-8 flex items-center gap-2.5 pl-3 pr-4 rounded-xl bg-white/3 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group/task">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover/task:bg-primary transition-colors" />
                    <span className="text-[11px] font-bold text-white/60 group-hover/task:text-white truncate">
                      {log.task.title}
                    </span>
                    <ArrowRight className="h-3 w-3 text-white/10 group-hover/task:text-primary transition-all translate-x-0 group-hover/task:translate-x-0.5" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
