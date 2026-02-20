import { Search, Bell, Menu, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getImageUrl } from "@/lib/media";

interface TopbarProps {
  setMobileOpen: (v: boolean) => void;
}

export function Topbar({ setMobileOpen }: TopbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 lg:h-20 border-b border-white/5 bg-[#0d0d1a]/40 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 lg:gap-4 flex-1 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-muted-foreground hover:text-white shrink-0"
        >
          <Menu className="h-6 w-6" />
        </Button>
        {!showMobileSearch && (
          <div className="text-xs lg:text-sm text-muted-foreground hidden sm:flex items-center gap-2 truncate">
            <span>Home</span>
            <span>›</span>
            <span className="text-white font-medium">Dashboard</span>
          </div>
        )}
        <div
          className={cn(
            "flex-1 items-center gap-2",
            showMobileSearch
              ? "flex animate-in fade-in slide-in-from-left-2"
              : "hidden md:flex",
          )}
        >
          <div className="relative w-full max-w-xs group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              autoFocus={showMobileSearch}
              placeholder="Search (Cmd+K)"
              className="h-9 lg:h-10 pl-9 lg:pl-10 bg-white/5 border-white/5 focus:border-primary/50 transition-all rounded-xl w-full text-xs"
            />
          </div>
          {showMobileSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4 flex-1 justify-end shrink-0">
        {!showMobileSearch && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden text-muted-foreground hover:text-white"
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-1 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl relative shrink-0"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-[#0d0d1a]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-xl p-0 overflow-hidden border border-white/10 shrink-0"
              >
                <Avatar className="h-full w-full">
                  <AvatarImage src={getImageUrl(user?.profileImage)} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {user?.name?.substring(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-[#0d0d1a] border-white/10"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="text-muted-foreground focus:text-white focus:bg-white/5 cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground focus:text-white focus:bg-white/5 cursor-pointer">
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-muted-foreground focus:text-white focus:bg-white/5 cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 focus:text-red-300 focus:bg-red-400/10 cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
