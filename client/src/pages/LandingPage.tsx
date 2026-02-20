import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingCTA } from "@/components/landing/LandingCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080812] selection:bg-white/10 selection:text-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
      </main>

      <footer className="py-12 border-t border-white/5 bg-[#080812]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white tracking-tighter">
              TASK<span className="text-white/40">FORGE</span>
            </span>
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
              © 2026 Systems Inc.
            </span>
          </div>

          <div className="flex gap-8 items-center">
            <a
              href="#"
              className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
            >
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
