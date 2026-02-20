import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Users,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { getImageUrl } from "@/lib/media";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  group: string;
  badge?: number;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    group: "Main Menu",
  },
  {
    label: "Projects",
    icon: FolderOpen,
    href: "/projects",
    group: "Main Menu",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    href: "/tasks",
    group: "Main Menu",
  },
];

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthStore();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const displayNavItems = [...navItems];
  if (user?.role === "SUPER_USER") {
    displayNavItems.push({
      label: "Users",
      icon: Users,
      href: "/users",
      group: "Administration",
    });
  }

  const groups = Array.from(new Set(displayNavItems.map((i) => i.group)));

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={
          isDesktop
            ? { width: collapsed ? "80px" : "260px", x: 0 }
            : { width: "260px", x: mobileOpen ? 0 : -260 }
        }
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#0d0d1a]/80 backdrop-blur-xl border-r border-white/5 h-full flex flex-col transition-all duration-300 ease-in-out lg:relative",
          !mobileOpen && "max-lg:pointer-events-none",
        )}
      >
        <div className="h-20 flex items-center px-6 gap-3 border-b border-white/5 relative">
          <div className="h-10 w-10 min-w-[40px] rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg tracking-tight text-white leading-tight">
                TaskForge
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                Workspace A
              </span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 lg:hidden text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl h-9 w-9"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4 px-3">
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group} className="space-y-1">
                {!collapsed && (
                  <h3 className="px-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">
                    {group}
                  </h3>
                )}
                {displayNavItems
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-white hover:bg-white/5",
                        )}
                      >
                        <item.icon
                          className={
                            isActive ? "text-primary" : "group-hover:text-white"
                          }
                          size={20}
                        />
                        {!collapsed && (
                          <span className="text-[14px] font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={getImageUrl(user?.profileImage)} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {user?.name?.substring(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.role}
                </span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full hidden lg:flex items-center justify-center gap-2 h-9 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg border border-white/5"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
