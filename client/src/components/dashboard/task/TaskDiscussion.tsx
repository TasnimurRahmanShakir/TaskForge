import { useState, useEffect } from "react";
import { MessageSquare, Loader2, ClipboardList, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getImageUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { Task, Comment } from "@/lib/types";

interface TaskDiscussionProps {
  task: Task;
}

const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export function TaskDiscussion({ task }: TaskDiscussionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<{ comments: Comment[] }>(
        `/comments/task/${task.id}`,
      );
      // Ensure we're pulling from the correct data structure
      const commentData = Array.isArray(response)
        ? response
        : (response as any).comments || [];
      setComments(commentData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [task.id]);

  const handlePostComment = async () => {
    if (!newComment.trim() || isPosting) return;

    setIsPosting(true);
    try {
      await api.post("/comments", {
        content: newComment,
        taskId: task.id,
      });
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Post Comment Box - Moved to top for better UX in discussion */}
      <div className="glass-morphism rounded-3xl p-6 border border-white/5 space-y-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 shrink-0 border-2 border-white/10 shadow-lg">
            <AvatarImage src="" /> {/* Current user image would go here */}
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-black">
              ME
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <textarea
              placeholder="Add to the discussion..."
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isPosting}
              className="w-full bg-white/3 border border-white/10 focus:border-primary/50 focus:bg-white/5 transition-all rounded-2xl text-sm text-white placeholder:text-white/20 p-4 resize-none focus:outline-none custom-scrollbar disabled:opacity-50 min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handlePostComment}
                disabled={!newComment.trim() || isPosting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 px-8 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isPosting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-2" /> Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Timeline */}
      <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 text-primary/40 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-white/3 flex items-center justify-center border border-white/5">
              <MessageSquare className="h-6 w-6 text-white/10" />
            </div>
            <p className="text-sm font-medium text-white/20">
              No discussion yet.
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative"
            >
              <Avatar className="h-10 w-10 shrink-0 border-2 border-white/10 z-10 shadow-xl bg-[#080812]">
                <AvatarImage src={getImageUrl(comment.author.profileImage)} />
                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-black uppercase">
                  {comment.author.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 min-w-0 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-black text-white tracking-tight">
                    {comment.author.name}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <div className="bg-white/3 border border-white/5 rounded-2xl rounded-tl-none p-4 text-sm text-white/70 leading-relaxed shadow-sm">
                  {comment.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
