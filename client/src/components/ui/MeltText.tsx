import { motion } from "framer-motion";
import { useMemo } from "react";

const MeltChar = ({ char }: { char: string }) => {
  // Generate random physics for this specific letter
  const params = useMemo(() => {
    return {
      // Wiggle: Random rotation between -5deg and 5deg
      rotate: (Math.random() - 0.5) * 10,
      // Shake: Random X/Y offset between -2px and 2px
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      // Timing: How fast this specific letter wiggles (1.5s to 3s)
      wiggleDuration: 1.5 + Math.random() * 1.5,
      // Color: How fast it cycles through the rainbow (3s to 6s)
      colorDuration: 3 + Math.random() * 3,
      // Offset: Start the animation at a random point so letters aren't synced
      delay: Math.random() * -5
    };
  }, []);

  return (
    <motion.span
      className="inline-block whitespace-pre font-bold drop-shadow-md"
      animate={{
        // 1. The Wiggle (Rotation + slight shake)
        rotate: [0, params.rotate, 0, -params.rotate, 0],
        x: [0, params.x, 0, -params.x, 0],
        y: [0, params.y, 0, -params.y, 0],
        // 2. The Rainbow Cycle (Full Spectrum)
        color: [
          "#ff0000", // Red
          "#ffa500", // Orange
          "#ffff00", // Yellow
          "#00ff00", // Green
          "#00ffff", // Cyan
          "#0000ff", // Blue
          "#ff00ff", // Magenta
          "#ff0000"  // Red
        ]
      }}
      transition={{
        // Independent timing for the wiggle
        rotate: {
          duration: params.wiggleDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: params.delay
        },
        x: {
          duration: params.wiggleDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: params.delay
        },
        y: {
          duration: params.wiggleDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: params.delay
        },
        // Independent timing for the color cycle
        color: {
          duration: params.colorDuration,
          repeat: Infinity,
          ease: "linear",
          delay: params.delay
        }
      }}
    >
      {char}
    </motion.span>
  );
};

export function MeltText({ text, className = "", as: Component = "div" }: any) {
  return (
    <Component className={`flex flex-wrap ${className}`}>
      {String(text).split("").map((char, i) => (
        <MeltChar key={i} char={char} />
      ))}
    </Component>
  );
}
