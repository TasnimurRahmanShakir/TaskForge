import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-premium rounded-[40px] p-12 md:p-20 flex flex-col items-center text-center border border-white/10 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 max-w-2xl leading-none"
          >
            READY TO FORGE <br />
            <span className="text-white/40">YOUR SUCCESS?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 font-medium mb-12 max-w-lg"
          >
            Join high-performance teams already using TaskForge to master their
            workflow and eliminate bottlenecks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="h-16 px-12 bg-white text-black hover:bg-white/90 font-black rounded-2xl group transition-all text-lg shadow-2xl shadow-white/5"
              onClick={() => navigate("/signup")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-6 text-white/30 text-xs font-bold uppercase tracking-widest">
              No credit card required • Enterprise ready
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
