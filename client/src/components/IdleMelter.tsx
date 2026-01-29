import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * IdleMelter Component
 * 
 * Handles the screen distortion effects when the user is inactive.
 * Implements "Idle Melter" logic: Interface slowly drifts/softens on inactivity.
 * 
 * Features:
 * - Activates after 300 seconds (5 minutes) of inactivity
 * - Progressive visual distortion using CSS filters and SVG filters
 * - Prevents screen burn-in
 * - Provides passive entertainment during idle states
 * - Automatically deactivates on user interaction
 * 
 * Monitors: mousemove, mousedown, keydown, scroll, touchstart events
 */
export function IdleMelter() {
  const [isMelting, setIsMelting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const IDLE_TIME = 300000; // 5 Minutes

    const goTrippy = () => {
      setIsMelting(true);
      document.body.classList.add("melting-mode");
    };

    const wakeUp = () => {
      if (document.body.classList.contains("melting-mode")) {
        setIsMelting(false);
        document.body.classList.remove("melting-mode");
      }
      clearTimeout(timeout);
      timeout = setTimeout(goTrippy, IDLE_TIME);
    };

    window.addEventListener("mousemove", wakeUp);
    window.addEventListener("mousedown", wakeUp);
    window.addEventListener("keydown", wakeUp);
    window.addEventListener("scroll", wakeUp);
    window.addEventListener("touchstart", wakeUp);

    wakeUp();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", wakeUp);
      window.removeEventListener("mousedown", wakeUp);
      window.removeEventListener("keydown", wakeUp);
      window.removeEventListener("scroll", wakeUp);
      window.removeEventListener("touchstart", wakeUp);
    };
  }, []);

  return (
    <AnimatePresence>
      {isMelting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, duration: 1 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* 1. LIQUID DISTORTION FILTER DEFINITION */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="warp-filter">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.01"
                  numOctaves="3"
                  result="warp"
                />
                <feDisplacementMap
                  xChannelSelector="R"
                  yChannelSelector="G"
                  scale="30"
                  in="SourceGraphic"
                  in2="warp"
                />
              </filter>
            </defs>
          </svg>

          {/* 2. PROGRESSIVE BACKGROUND WARP */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            animate={{
              backdropFilter: [
                "blur(2px) hue-rotate(0deg)",
                "blur(4px) hue-rotate(90deg)",
                "blur(10px) hue-rotate(180deg)",
                "blur(4px) hue-rotate(360deg)",
              ],
              backgroundColor: [
                "rgba(0,0,0,0.2)",
                "rgba(20,0,50,0.4)",
                "rgba(0,50,20,0.4)",
                "rgba(0,0,0,0.2)",
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          />

          {/* 3. WARPING TEXT ANIMATION */}
          <div className="text-center relative z-20 mix-blend-screen">
            <motion.p
              className="animate-rainbow font-mono text-4xl md:text-6xl tracking-[0.2em] uppercase font-black"
              initial={{ opacity: 0, scale: 1, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0.8, 1],
                // PROGRESSIVE CHAOS:
                // 1. Float Up
                // 2. Skew/Bend
                // 3. Twist/Rotate
                // 4. Melt (Scale + Filter)
                y: [0, -20, 20, 0, -50, 0],
                rotate: [0, 2, -2, 10, -10, 180, 360],
                skewX: [0, 5, -5, 20, -20, 45, 0],
                scale: [1, 1.1, 0.9, 1.5, 0.5, 1.2],
                filter: [
                  "none",
                  "blur(0px)",
                  "blur(2px) url(#warp-filter)", // Apply Liquid Filter mid-animation
                  "blur(0px)",
                ],
              }}
              transition={{
                duration: 20, // 20 Second Loop of Intensity
                times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1], // Timing stages
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              Drifting...
            </motion.p>

            {/* Ghost echo for extra trippiness */}
            <motion.p
              className="absolute inset-0 text-white/30 blur-sm"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              Drifting...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
