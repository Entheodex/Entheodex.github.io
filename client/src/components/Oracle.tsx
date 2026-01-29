import { AnimatePresence, motion } from "framer-motion";
import { Disc, Eye, Sparkles, Zap, Phone, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { MeltText } from "./ui/MeltText";

/**
 * Props for Oracle component
 */
interface OracleProps {
  /** If true, prevents consultation (useful for global pause states) */
  isPaused?: boolean;
}

// --- UNIVERSAL PHRASES DATABASE ---
const RAW_PHRASES = [
  // --- Safety & Grounding ---
  "You are safe. This is just a chemical reaction.",
  "You took a substance. It will end.",
  "Your body knows how to breathe on its own.",
  "Gravity is holding you. Trust the floor.",
  "You are in a safe container.",
  "Time feels strange, but it is moving forward.",
  "No feeling is final.",
  "You are exactly where you are supposed to be.",
  "The world will be there when you get back.",
  "You are the observer, not the storm.",

  // --- Surrender & Flow ---
  "Don't fight the current. Float downstream.",
  "Curiosity over fear.",
  "Lean into the experience.",
  "Say 'yes' to what is happening.",
  "Let the thoughts drift by like clouds.",
  "Surrender to the moment.",
  "Trust your own mind.",
  "There is nothing you need to do right now.",
  "Let go of the need to control.",
  "Ride the wave, don't try to stop it.",

  // --- Somatic (Body) Awareness ---
  "Unclench your jaw. Drop your shoulders.",
  "Soften your gaze.",
  "Breathe into your belly.",
  "Wiggle your toes. Feel your feet.",
  "Sip some water. Nourish your cells.",
  "Place a hand on your heart.",
  "Stretch your arms. Take up space.",
  "Check your posture. Sit tall.",
  "Relax your forehead.",
  "Wrap yourself in a blanket.",

  // --- Environment & Action ---
  "Change the music. Change the vibe.",
  "Look at something green.",
  "Turn down the lights.",
  "Step into a new room.",
  "Touch a texture you like.",
  "It is okay to close your eyes.",
  "It is okay to open your eyes.",
  "Find a soft place to rest.",
  "Listen to the silence between the sounds.",

  // --- Emotional & Spiritual ---
  "Be gentle with yourself.",
  "You are allowed to feel this.",
  "Laugh at the absurdity.",
  "You are loved.",
  "This is a learning experience.",
  "Forgive yourself for feeling overwhelmed.",
  "There is beauty in this chaos.",
  "You are connected to everything.",
  "Your mind is vast and resilient.",
  "Whatever comes up, greet it with kindness."
];

const IntricateMandala = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70 overflow-hidden z-0">
    <div 
      className="absolute w-[300%] h-[300%] opacity-50 mix-blend-overlay animate-[spin_120s_linear_infinite]"
      style={{ 
        backgroundImage: "radial-gradient(circle, hsl(var(--neon-purple)) 2px, transparent 2px)", 
        backgroundSize: "40px 40px" 
      }}
    />
    <div 
      className="absolute w-[300%] h-[300%] opacity-50 mix-blend-overlay animate-[spin_180s_linear_infinite_reverse]"
      style={{ 
        backgroundImage: "radial-gradient(circle, hsl(var(--neon-green)) 2px, transparent 2px)", 
        backgroundSize: "35px 35px" 
      }}
    />

    {[...Array(6)].map((_, i) => (
      <div
        key={`spiro-${i}`}
        className="absolute border border-[hsl(var(--neon-purple))] opacity-60 mix-blend-screen animate-[spin_60s_linear_infinite]"
        style={{ 
            width: "400px", 
            height: "100px", 
            borderRadius: "50%", 
            borderWidth: "1px",
            animationDelay: `-${i * 5}s`,
            transform: `rotate(${i * 30}deg)`
        }}
      />
    ))}

    {[...Array(6)].map((_, i) => (
      <div
        key={`tunnel-${i}`}
        className="absolute border-2 border-[hsl(var(--neon-green))] rounded-full"
        style={{ 
            width: "50px", 
            height: "50px", 
            opacity: 0.3,
            animation: "tunnel-zoom 8s linear infinite",
            animationDelay: `${i * 1.3}s`
        }}
      />
    ))}

    <div className="absolute w-[300px] h-[300px] mix-blend-screen opacity-60">
       <div 
         className="absolute inset-0 border-2 border-[hsl(var(--neon-green))]"
         style={{ 
           clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
           animation: "pulse-spin 10s linear infinite"
         }}
       />
    </div>

    <style>{`
      @keyframes tunnel-zoom {
        0% { transform: scale(0) rotate(0deg); opacity: 0.3; }
        50% { opacity: 0.8; }
        100% { transform: scale(15) rotate(90deg); opacity: 0.2; }
      }
      @keyframes pulse-spin {
        0% { transform: scale(1) rotate(0deg); opacity: 0.6; }
        50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        100% { transform: scale(1) rotate(360deg); opacity: 0.6; }
      }
    `}</style>
  </div>
);

export function Oracle({ isPaused }: OracleProps) {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState<"Affirmation" | "HELP" | "Notepad">("Affirmation");
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem("oracle-notes") || "";
    } catch {
      return "";
    }
  });
  const [savedVisible, setSavedVisible] = useState(false);

  const isGrounding = activeTab === "HELP";

  useEffect(() => {
    const shuffled = [...RAW_PHRASES].sort(() => Math.random() - 0.5);
    setPhrases(shuffled);
  }, []);

  const consult = () => {
    if (isPaused) return;
    if (isGrounding) return;
    setIsSpinning(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10, 30, 10, 30, 50]);
    }

    setTimeout(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
      setIsSpinning(false);
    }, 800);
  };

  const handleSaveNotes = () => {
    try {
      localStorage.setItem("oracle-notes", notes);
      setSavedVisible(true);
      setTimeout(() => setSavedVisible(false), 2000);
    } catch {
      // ignore
    }
  };

  if (phrases.length === 0) return null;

  return (
    <GlassCard glowColor="purple" className="    flex flex-col relative group overflow-hidden">
      <div className={`flex flex-col     ${isGrounding ? "grounding-paused" : ""}`}>
        <IntricateMandala />

        {/* Header */}
        <div className="flex justify-between items-start relative border-b border-[hsl(var(--neon-purple))] pb-2 mx-2 mt-2 z-10 shrink-0 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Disc className={`w-6 h-6 text-[hsl(var(--neon-purple))] ${isGrounding ? '' : 'animate-[spin_3s_linear_infinite]'}`} />
            <MeltText text="THE ORACLE" as="h2" className="text-xl tracking-widest text-white" />
          </div>
          <div className="text-[hsl(var(--neon-purple))]">
             <Sparkles className={`w-3 h-3 ${isGrounding ? '' : 'animate-pulse'}`} />
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 mt-3 mb-2 mx-2 z-10 shrink-0 flex-shrink-0">
          <div className="flex items-center gap-1">
            {(["Affirmation","HELP","Notepad"] as const).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-t-md text-sm font-mono transition-colors cursor-pointer ${
                    active
                      ? "text-green-400 border-b-2 border-green-500 bg-transparent font-bold"
                      : "text-white/80 bg-black/30 hover:text-white hover:bg-black/40"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Display - Added overflow-y-auto so it scrolls if text is huge */}
        <div className="flex-1 flex items-center justify-center py-6 px-4 relative z-10 min-h-0   overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "Affirmation" && (
              !isSpinning ? (
                <motion.div
                  key={`affirm-${index}`}
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
                  className="text-xl md:text-2xl font-bold text-center leading-relaxed font-mono relative animate-rainbow"
                >
                  {phrases[index]}
                </motion.div>
              ) : (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className={`absolute inset-0 border-4 border-[hsl(var(--neon-purple))] rounded-full border-t-transparent ${isGrounding ? '' : 'animate-spin'}`} />
                    <div className={`absolute inset-0 w-full border-2 border-[hsl(var(--neon-pink))]/50 ${isGrounding ? '' : 'animate-[spin_2s_linear_infinite_reverse]'}`} style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                    <Eye className={`w-8 h-8 text-[hsl(var(--neon-purple))] ${isGrounding ? '' : 'animate-pulse'} drop-shadow-[0_0_10px_hsl(var(--neon-purple))]`} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono text-[hsl(var(--neon-purple))] tracking-[0.3em]">ALIGNING FATE</span>
                  </div>
                </motion.div>
              )
            )}

            {activeTab === "HELP" && (
              <motion.div
                key="help"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col items-center gap-4"
              >
                <div className="w-full flex flex-col md:flex-row gap-3">
                  <a
                    href="https://firesideproject.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-left p-4 glass-panel border-2 border-white/20 rounded-lg flex items-center gap-3 hover:scale-[0.995] hover:border-green-400/50 transition-all cursor-pointer bg-black/20"
                  >
                    <Phone className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-bold text-purple-800">Call Support</div>
                      <div className="text-xs text-purple-800">firesideproject.org</div>
                    </div>
                  </a>

                  <a
                    href="https://tripsit.me/webchat"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-left p-4 glass-panel border-2 border-white/20 rounded-lg flex items-center gap-3 hover:scale-[0.995] hover:border-green-400/50 transition-all cursor-pointer bg-black/20"
                  >
                    <MessageCircle className="w-6 h-6 text-green-400" />
                    <div>
                      <div className="font-bold text-purple-800">Chat Support</div>
                      <div className="text-xs text-purple-800">tripsit.me/webchat</div>
                    </div>
                  </a>
                </div>
                <div className="text-sm text-purple-800">Grounding Mode active — animations minimized.</div>
              </motion.div>
            )}

            {activeTab === "Notepad" && (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col gap-3"
              >
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    try { localStorage.setItem("oracle-notes", e.target.value); } catch {}
                  }}
                  onBlur={() => {
                    try { localStorage.setItem("oracle-notes", notes); } catch {}
                    setSavedVisible(true);
                    setTimeout(() => setSavedVisible(false), 2000);
                  }}
                  className="w-full min-h-[120px] p-3 rounded-lg bg-black/40 text-purple-800 border-2 border-white/20 outline-none focus:border-[hsl(var(--neon-purple))]/50 focus:ring-2 focus:ring-[hsl(var(--neon-purple))]/20 placeholder:text-purple-800"
                  placeholder="Brain dump... let it out. Your notes are saved locally."
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 rounded bg-[hsl(var(--neon-purple))] text-[hsl(var(--neon-green))] font-bold hover:bg-[hsl(var(--neon-purple))]/80 transition-colors cursor-pointer border-2 border-[hsl(var(--neon-green))]/30"
                  >
                    Save
                  </button>
                  {savedVisible && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[hsl(var(--neon-green))] font-mono"
                    >
                      Saved!
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button - NOW INSIDE THE FLEX WRAPPER */}
        <div className="relative p-2 bg-black/40 backdrop-blur-sm border-t border-[hsl(var(--neon-purple))] z-10 shrink-0 flex-shrink-0">
          {activeTab === "Affirmation" && (
            <button 
              onClick={consult}
              className="relative w-full py-4 overflow-hidden rounded-lg group/btn cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--neon-purple))/30] via-[hsl(var(--neon-purple))/20] to-[hsl(var(--neon-purple))/30] border-2 border-[hsl(var(--neon-green))] group-hover/btn:border-[hsl(var(--neon-purple))] transition-colors rounded-lg" />
              <div className="relative flex items-center justify-center gap-3 text-[hsl(var(--neon-purple))] font-mono font-bold tracking-[0.2em] group-hover/btn:text-[hsl(var(--neon-green))] transition-colors z-10">
                <Zap className={`w-4 h-4 ${isSpinning ? 'text-[hsl(var(--neon-pink))] animate-bounce' : ''}`} />
                <span>CONSULT</span>
              </div>
            </button>
          )}
        </div>

      </div> {/* END OF FLEX COL WRAPPER */}

      <style>{`
        .grounding-paused * {
          animation-play-state: paused !important;
          transition: none !important;
        }
      `}</style>
    </GlassCard>
  );
}