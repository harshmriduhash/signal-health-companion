import { motion } from "framer-motion";

interface Props {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export default function AIThinkingAnimation({ label = "AI is thinking…", size = "md" }: Props) {
  const dotSize = size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-3 h-3" : "w-2 h-2";
  const containerSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${containerSize} relative`}>
        {/* Center core */}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Orbiting dots */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className={`absolute inset-0 m-auto ${dotSize} rounded-full bg-accent`}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.8,
            }}
            style={{
              transformOrigin: `50% 50%`,
              translate: `${Math.cos((i * 2 * Math.PI) / 3) * 14}px ${Math.sin((i * 2 * Math.PI) / 3) * 14}px`,
            }}
          >
            <motion.div
              className={`${dotSize} rounded-full bg-primary`}
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
            />
          </motion.div>
        ))}
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      {label && (
        <motion.p
          className="text-xs text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
