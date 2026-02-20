import { motion } from "framer-motion";
import {
  Layout,
  CheckSquare,
  Users2,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Layout,
    title: "Pro Kanban Boards",
    description:
      "Manage complex workstreams with an interface optimized for speed and clarity.",
    color: "text-blue-400",
  },
  {
    icon: CheckSquare,
    title: "Atomic Checklists",
    description:
      "Break deliverables into precision steps with real-time status persistence.",
    color: "text-emerald-400",
  },
  {
    icon: Users2,
    title: "Team Calibration",
    description:
      "Keep every stakeholder aligned with synchronized project views and discussion layers.",
    color: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Instant Execution",
    description:
      "Zero-latency updates powered by our optimized persistent storage architecture.",
    color: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Role-based access control ensuring data integrity across every permission tier.",
    color: "text-rose-400",
  },
  {
    icon: BarChart3,
    title: "Project Metrics",
    description:
      "Real-time progress recalculation provides a bird's-eye view of project health.",
    color: "text-indigo-400",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-[#080812]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
            ENGINEERED FOR <span className="text-white/40">EFFICIENCY.</span>
          </h2>
          <p className="text-white/50 font-medium max-w-xl mx-auto">
            A specialized toolset designed to eliminate friction and maximize
            your team's industrial output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="studio-card p-8 group flex flex-col items-start text-left"
            >
              <div
                className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
