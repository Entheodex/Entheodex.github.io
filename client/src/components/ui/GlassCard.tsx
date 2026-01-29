import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "purple" | "cyan" | "pink" | "green";
}

export function GlassCard({ children, className, glowColor = "purple" }: GlassCardProps) {
  const glowStyles = {
    purple: "border-purple-500/30 shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]",
    cyan: "border-cyan-500/30 shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]",
    pink: "border-pink-500/30 shadow-[0_0_30px_-5px_rgba(236,72,153,0.2)]",
    green: "border-green-500/30 shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass-panel p-6",
        glowStyles[glowColor],
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      {children}
    </motion.div>
  );
}
