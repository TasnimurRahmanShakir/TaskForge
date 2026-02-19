import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  text: string;
  time: string;
}

const activityLog: ActivityItem[] = [
  { text: "Status changed to In Progress", time: "3h ago" },
  { text: "Task created by Alex Morgan", time: "5h ago" },
];

export function TaskDiscussion() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src="https://i.pravatar.cc/150?u=sj" />
          <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-black">
            SJ
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-white">
              Sarah Jenkins
            </span>
            <span className="text-[10px] text-white/30">2 hours ago</span>
          </div>
          <div className="bg-white/3 border border-white/6 rounded-xl p-3 text-sm text-white/65 leading-relaxed">
            Mission parameters verified. Ready for the next phase of deployment.
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mb-3">
          Activity
        </p>
        {activityLog.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 text-xs text-white/40 py-2 border-b border-white/4"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
            <span className="truncate">{item.text}</span>
            <span className="ml-auto text-[10px] text-white/20 shrink-0">
              {item.time}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <textarea
          placeholder="Write a comment..."
          rows={3}
          className="w-full bg-white/3 border border-white/10 focus:border-primary/50 focus:bg-white/5 transition-all rounded-xl text-sm text-white placeholder:text-white/25 p-3 resize-none focus:outline-none"
        />
        <div className="flex justify-end">
          <Button
            type="button"
            className="bg-primary/15 text-primary hover:bg-primary/25 border border-primary/25 font-semibold text-xs h-9 px-5 rounded-lg transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
