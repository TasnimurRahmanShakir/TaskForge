import { useState, type ReactNode } from "react";
import { Sidebar } from "../dashboard/Sidebar";
import { Topbar } from "../dashboard/Topbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

export function DashboardLayout({
  children,
  mainClassName,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-svh bg-[#06060c] text-white flex overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-30" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-20" />
        <Topbar setMobileOpen={setMobileOpen} />
        <main
          className={cn(
            "flex-1 overflow-x-hidden overflow-y-auto bg-transparent relative z-10 custom-scrollbar",
            mainClassName,
          )}
        >
          <div
            className={cn(
              "w-full px-4 lg:px-8 py-6 sm:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
              mainClassName?.includes("h-full") && "h-full flex flex-col",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
