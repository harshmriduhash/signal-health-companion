import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
  glow?: boolean;
}

export default function MotionCard({ children, className, delay = 0, hover = true, glow = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-shadow duration-300",
        hover && "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        glow && "glow-primary",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
