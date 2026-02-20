import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-blob-slow" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-bold text-white/80 tracking-widest uppercase">
            Engineering a Faster Workflow
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black text-center text-white tracking-tighter mb-8 leading-[0.9]"
        >
          FORGE YOUR <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white/80 to-white/40">
            STRATEGY.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-center text-white/50 text-lg md:text-xl font-medium mb-12"
        >
          TaskForge is the premium ecosystem for high-performance teams. Master
          your projects with industrial-grade Kanban, intelligent checklists,
          and real-time execution layers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="h-14 px-10 bg-white text-black hover:bg-white/90 font-black rounded-2xl group transition-all"
            onClick={() => navigate("/signup")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-10 glass border-white/10 text-white font-bold hover:bg-white/5 rounded-2xl"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 w-full max-w-6xl relative"
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#080812] via-transparent to-transparent z-10" />
          <div className="glass-premium rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
            <div className="h-6 w-full glass border-b border-white/5 flex items-center gap-1.5 px-4">
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
            </div>
            {/* 
              Showcase image will go here. Using a high-quality div placeholder 
              with dynamic patterns if image generation fails.
            */}
            <div className="aspect-16/10 bg-[#0d0d1a] relative group overflow-hidden">
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/5 flex flex-col items-center gap-4 group-hover:text-white/10 transition-colors">
                  <Layers className="h-32 w-32" />
                  <span className="text-2xl font-black tracking-widest uppercase">
                    System Interface
                  </span>
                </div>
              </div>

              {/* Mock UI elements for extra detail */}
              <div className="absolute top-10 left-10 w-48 h-64 glass border-white/5 rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
                <div className="h-4 w-24 bg-white/10 rounded-full" />
                <div className="h-4 w-full bg-white/5 rounded-full" />
                <div className="h-12 w-full bg-white/5 rounded-xl" />
                <div className="h-12 w-full bg-white/5 rounded-xl" />
              </div>

              <div className="absolute bottom-10 right-10 w-72 h-48 glass border-white/5 rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-white/10 rounded-full" />
                  <div className="h-6 w-6 bg-white/10 rounded-lg" />
                </div>
                <div className="flex-1 bg-white/3 rounded-xl flex items-center justify-center">
                  <div className="w-4/5 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-3/5 h-full bg-emerald-500/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
