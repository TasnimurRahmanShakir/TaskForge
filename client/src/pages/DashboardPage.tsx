import {
  ListChecks,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { RecentTasks } from "@/components/dashboard/RecentTasks";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Alex
              </span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Here&apos;s what&apos;s happening in your workspace today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold h-11 px-6 rounded-xl hidden sm:flex"
            >
              Export Report
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-11 px-6 rounded-xl shadow-[0_0_25px_-10px_var(--color-primary)] transition-all">
              <Plus className="h-5 w-5 mr-2" /> New Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Tasks"
            value="124"
            trend="up"
            trendValue="+12%"
            icon={ListChecks}
            color="primary"
          />
          <StatCard
            title="Completed"
            value="42"
            trend="up"
            trendValue="+8%"
            icon={CheckCircle}
            color="success"
          />
          <StatCard
            title="Overdue"
            value="3"
            trend="down"
            trendValue="+2%"
            icon={Clock}
            color="warning"
          />
          <StatCard
            title="Productivity"
            value="87%"
            trend="up"
            trendValue="Excellent"
            icon={Zap}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ProductivityChart />
          </div>
          <div className="xl:col-span-1">
            <RecentTasks />
          </div>
        </div>

        <div className="relative group overflow-hidden rounded-3xl bg-linear-to-r from-primary/10 via-purple-500/10 to-transparent border border-white/5 p-6 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:bg-white/4">
          <div className="relative z-10 space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Need more tools?
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Upgrade to TaskForge Pro to unlock advanced reporting, unlimited
              projects, and team collaboration features.
            </p>
          </div>
          <Button className="relative z-10 w-full sm:w-auto bg-white text-black hover:bg-white/90 font-black h-12 sm:h-14 px-8 rounded-2xl group transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
            Upgrade Now{" "}
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] animate-pulse" />
        </div>
      </div>
    </DashboardLayout>
  );
}
