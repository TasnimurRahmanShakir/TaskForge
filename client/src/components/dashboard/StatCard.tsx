import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: "up" | "down";
  trendValue: string;
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "purple";
}

export function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  color,
}: StatCardProps) {
  const isPositive = trend === "up";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-morphism rounded-2xl p-6 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground/60">
            {title}
          </p>
          <h3 className="text-3xl font-bold tracking-tight text-white">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center border border-white/10 transition-colors duration-500",
            color === "primary" &&
              "bg-primary/10 text-primary group-hover:bg-primary/20",
            color === "success" &&
              "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20",
            color === "warning" &&
              "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20",
            color === "purple" &&
              "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20",
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-full",
            isPositive
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-400/10 text-red-400",
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{trendValue}</span>
        </div>
        <span className="text-xs text-muted-foreground/40 font-medium whitespace-nowrap">
          vs last week
        </span>
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500",
          color === "primary" && "bg-primary shadow-[0_0_10px_var(--primary)]",
          color === "success" &&
            "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]",
          color === "warning" &&
            "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
          color === "purple" &&
            "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
        )}
      />
    </motion.div>
  );
}
