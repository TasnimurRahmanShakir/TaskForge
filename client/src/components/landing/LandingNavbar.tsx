import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

export function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-7xl glass-premium rounded-2xl px-6 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="h-9 w-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">
            TASK<span className="text-white/40">FORGE</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Workflow
          </a>
          <a
            href="#pricing"
            className="text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white font-bold"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
          <Button
            size="sm"
            className="bg-white text-black hover:bg-white/90 font-black px-6 rounded-xl"
            onClick={() => navigate("/signup")}
          >
            Start Hub
          </Button>
        </div>
      </div>
    </nav>
  );
}
