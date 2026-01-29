import React, { useState, useEffect, useMemo } from "react";
import { GlassCard } from "./ui/GlassCard";
import { MeltText } from "./ui/MeltText";
import {
  formatDistanceToNow,
  differenceInMinutes,
  format,
} from "date-fns";
import {
  ExternalLink,
  ChevronDown,
  History,
  Trash2,
  Activity,
  Clock,
  Syringe,
  Zap,
  Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORT DATA ---
import drugsData from "../data/drugs.json";

// --- TYPES ---
interface DrugEntry {
  name: string;
  pretty_name: string;
  formatted_duration?: { value: string; _unit: string };
  formatted_onset?: { value: string; _unit: string };
  formatted_dose?: Record<string, any>;
  links?: { experiences?: string };
  properties?: {
    summary?: string;
    duration?: string;
    onset?: string;
    "after-effects"?: string;
  };
}

interface Dose {
  id: number;
  substance: string;
  route: string;
  quantity: string;
  unit: string;
  doseTime: string;
}

// --- CONSTANTS ---
const STANDARD_ROUTES = [
  "Oral", "Smoked", "Vaporized", "Insufflated", 
  "Sublingual", "Buccal", "Rectal", "IV", "IM"
];

// --- HELPER: CONTEXT-AWARE TIME PARSER ---
const parseTimeRange = (drug: DrugEntry, field: 'onset' | 'duration', route: string = ""): number => {
  const drugName = (drug.name || "").toLowerCase();
  const routeLower = route.toLowerCase();
  const isSmoked = routeLower.includes("smoke") || routeLower.includes("vape") || routeLower.includes("inhale");
  const isSnorted = routeLower.includes("snort") || routeLower.includes("insuff");

  // --- 1. HARD OVERRIDES ---
  if (field === 'duration') {
    if (isSmoked) {
      if (drugName.includes("dmt") || drugName.includes("dimethyltryptamine")) return 20; 
      if (drugName.includes("salvia")) return 15; 
      if (drugName.includes("5-meo")) return 20; 
      if (drugName.includes("crack") || drugName.includes("cocaine")) return 45; 
      if (drugName.includes("cannabis") || drugName.includes("thc") || drugName.includes("weed")) return 180; 
    }
    if (isSnorted) {
       if (drugName.includes("cocaine")) return 60; 
       if (drugName.includes("ketamine")) return 75; 
    }
  }
  
  if (field === 'onset') {
    if (isSmoked) return 2; 
    if (isSnorted) return 10;
  }

  // --- 2. EXTRACT RAW STRING ---
  let valStr = "";
  let unitStr = "";

  // @ts-ignore
  if (drug[`formatted_${field}`]) {
    // @ts-ignore
    valStr = drug[`formatted_${field}`].value;
    // @ts-ignore
    unitStr = drug[`formatted_${field}`]._unit || "";
  } else if (drug.properties && drug.properties[field]) {
    valStr = drug.properties[field] || "";
    unitStr = valStr;
  }

  if (!valStr) {
    if (field === 'onset') return 30;
    if (field === 'duration') return 240;
    return 60;
  }

  // --- 3. RANGE PARSING LOGIC ---
  let calculatedVal = 0;
  const rangeMatch = valStr.match(/(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/);

  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[3]);
    calculatedVal = (min + max) / 2;
  } else {
    const singleMatch = valStr.match(/(\d+(\.\d+)?)/);
    if (singleMatch) {
      calculatedVal = parseFloat(singleMatch[1]);
    } else {
      return field === 'onset' ? 30 : 240;
    }
  }

  // --- 4. UNIT CONVERSION ---
  const lowerUnit = unitStr.toLowerCase();
  
  if (lowerUnit.includes("hour") || lowerUnit.includes("hr")) return calculatedVal * 60;
  if (lowerUnit.includes("min") || lowerUnit.includes("m")) return calculatedVal;

  // --- 5. AMBIGUITY HANDLER ---
  if (field === 'duration') {
    const SHORT_NAMES = ["salvia", "dmt", "nitrous", "k", "ketamine", "cocaine"];
    if (SHORT_NAMES.some(s => drugName.includes(s))) return calculatedVal;
    if (calculatedVal <= 24) return calculatedVal * 60; 
    return calculatedVal;
  }
  
  return calculatedVal;
};

export const BioClock: React.FC = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'tolerance'>('active');
  const [doses, setDoses] = useState<Dose[]>([]);
  const [now, setNow] = useState(new Date());

  // Input
  const [selectedDrugKey, setSelectedDrugKey] = useState<string>("");
  const [route, setRoute] = useState<string>("Oral");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("mg");

  // Tolerance
  const [lastDose, setLastDose] = useState<number>(100);
  const [desiredDose, setDesiredDose] = useState<number>(100);
  const [days, setDays] = useState<number>(1);
  const [tolResult, setTolResult] = useState<number>(0);

  // --- TICKER ---
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 5000); 
    return () => clearInterval(timer);
  }, []);

  // --- TOLERANCE EFFECT ---
  useEffect(() => {
    let estimatedAmount = 0;
    if (days >= 14) {
      estimatedAmount = desiredDose;
    } else {
      const tolerancePercent = 280.059565 * Math.pow(days, -0.412565956);
      estimatedAmount = desiredDose * (tolerancePercent / 100);
    }
    setTolResult(estimatedAmount);
  }, [lastDose, desiredDose, days]);

  // --- DATA LOADING ---
  const drugList = useMemo(() => {
    return Object.entries(drugsData as Record<string, DrugEntry>)
      .map(([key, data]) => ({
        key,
        name: data.pretty_name || data.name,
        data
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const currentDrugData = selectedDrugKey ? (drugsData as Record<string, DrugEntry>)[selectedDrugKey] : null;

  // --- ROUTE LIST BUILDER ---
  const availableRoutes = useMemo(() => {
    let routes = new Set<string>();
    if (currentDrugData?.formatted_dose) {
      Object.keys(currentDrugData.formatted_dose).forEach(r => routes.add(r));
    }
    STANDARD_ROUTES.forEach(r => routes.add(r));
    return Array.from(routes);
  }, [currentDrugData]);

  // Auto-Select Route Logic
  useEffect(() => {
    if (selectedDrugKey) {
        if (currentDrugData?.formatted_dose) {
             const keys = Object.keys(currentDrugData.formatted_dose);
             if (keys.length > 0) {
                 setRoute(keys[0]);
                 return;
             }
        }
        setRoute("Oral");
    }
  }, [selectedDrugKey, currentDrugData]);

  // Local Storage
  useEffect(() => {
    const saved = localStorage.getItem("enthodex_doses");
    if (saved) {
      try {
        setDoses(JSON.parse(saved));
      } catch (e) {
        console.error("Dose load error", e);
      }
    }
  }, []);

  const saveDoses = (newDoses: Dose[]) => {
    setDoses(newDoses);
    localStorage.setItem("enthodex_doses", JSON.stringify(newDoses));
  };

  const handleLogDose = () => {
    if (!selectedDrugKey) return;
    const newDose: Dose = {
      id: Date.now(),
      substance: currentDrugData?.pretty_name || selectedDrugKey,
      route: route,
      quantity: quantity || "0",
      unit: unit,
      doseTime: new Date().toISOString(),
    };
    saveDoses([newDose, ...doses]);
    setQuantity("");
    setActiveTab("active");
  };

  const deleteDose = (id: number) => {
    saveDoses(doses.filter(d => d.id !== id));
  };

  // --- PROGRESS LOGIC ---
  const getPhaseData = (dose: Dose) => {
    const drugEntry = drugList.find(d => d.name === dose.substance);
    const data = drugEntry ? drugEntry.data : null;
    
    // PASS ROUTE TO PARSER
    const onsetMins = data ? parseTimeRange(data, 'onset', dose.route) : 30;
    const durationMins = data ? parseTimeRange(data, 'duration', dose.route) : 240;
    
    const minsPassed = differenceInMinutes(now, new Date(dose.doseTime));
    
    // Total duration (Duration + 20% afterglow)
    const totalDuration = durationMins * 1.2; 
    const percentComplete = Math.min((minsPassed / totalDuration) * 100, 100);

    let stage = "Unknown";
    let gradient = "bg-gray-700";
    let textColor = "text-gray-400";
    let pulse = false;
    let icon = <Activity className="w-3 h-3" />;

    if (minsPassed < onsetMins) {
      stage = "Come Up";
      gradient = "bg-gradient-to-r from-green-400 to-blue-500";
      textColor = "text-green-400";
      pulse = true;
      icon = <Zap className="w-3 h-3 text-green-400" />;
    } else if (minsPassed < durationMins) {
      stage = "Peak / Plateau";
      gradient = "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500";
      textColor = "text-pink-400";
      pulse = true;
      icon = <Flame className="w-3 h-3 text-pink-400" />;
    } else if (minsPassed < totalDuration) {
      stage = "Comedown";
      gradient = "bg-gradient-to-r from-blue-600 to-purple-900";
      textColor = "text-blue-300";
      icon = <Activity className="w-3 h-3 text-blue-300" />;
    } else {
      stage = "Afterglow / Sober";
      gradient = "bg-gray-800";
      textColor = "text-gray-500";
    }

    if (percentComplete >= 100) pulse = false;

    return { stage, percentComplete, gradient, textColor, pulse, durationMins, icon };
  };

  const info = (() => {
    if (!currentDrugData) return null;
    const onset = currentDrugData.formatted_onset?.value || currentDrugData.properties?.onset || "Unknown";
    const duration = currentDrugData.formatted_duration?.value || currentDrugData.properties?.duration || "Unknown";
    const erowidLink = currentDrugData.links?.experiences || `https://erowid.org/search.php?q=${currentDrugData.name}`;
    return { onset, duration, erowidLink };
  })();

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full min-h-[600px]">
      
      {/* HEADER */}
      <div className="p-6 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(var(--neon-purple)/0.1)]">
            <Clock className="w-6 h-6 text-[hsl(var(--neon-purple))]" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-2xl font-black tracking-tighter text-white">
              {/* FIXED: Passing 'text' prop instead of children */}
              {/* @ts-ignore */}
              <MeltText text="BIO" />
              <span className="text-[hsl(var(--neon-green))] flex">
                {/* @ts-ignore */}
                <MeltText text="CLOCK" />
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              Temporal Metabolism Tracker
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex mt-6 gap-2 p-1 bg-black/40 rounded-xl">
          {(['active', 'history', 'tolerance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab 
                  ? "bg-white/10 text-[hsl(var(--neon-green))] shadow-[0_0_15px_rgba(0,255,255,0.1)]" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* === ACTIVE TAB === */}
        {activeTab === 'active' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Input Form */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">New Session</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-3 relative group">
                  <select
                    value={selectedDrugKey}
                    onChange={(e) => setSelectedDrugKey(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white appearance-none outline-none focus:border-[hsl(var(--neon-green))] transition-colors font-mono"
                  >
                    <option value="">-- Select Substance --</option>
                    {drugList.map((d) => (
                      <option key={d.key} value={d.key}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                <div className="relative group">
                   <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full h-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none outline-none focus:border-[hsl(var(--neon-purple))] transition-colors"
                  >
                    {availableRoutes.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <Syringe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none opacity-50" />
                </div>

                <div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Dose"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[hsl(var(--neon-purple))] transition-colors"
                  />
                </div>

                <div>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full h-full bg-black/40 border border-white/10 rounded-xl px-4 text-white outline-none focus:border-[hsl(var(--neon-purple))]"
                  >
                    <option value="mg">mg</option>
                    <option value="ug">µg</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="tabs">tabs</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleLogDose}
                disabled={!selectedDrugKey}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--neon-green))] text-black hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Timer
              </button>

              {info && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 flex justify-between items-center animate-fadeIn">
                  <span>Onset: <span className="text-white">{info.onset}</span></span>
                  <span>Duration: <span className="text-white">{info.duration}</span></span>
                  <a href={info.erowidLink} target="_blank" rel="noreferrer" className="text-[hsl(var(--neon-green))] hover:underline flex items-center gap-1">
                    Erowid <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* PROGRESS BARS */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" /> Currently Active
              </h3>
              
              <AnimatePresence>
                {doses.filter(d => getPhaseData(d).stage !== "Afterglow / Sober").length === 0 ? (
                  <div className="text-center py-10 text-gray-600 italic border-2 border-dashed border-white/5 rounded-xl">
                    No active compounds detected.
                  </div>
                ) : (
                  doses.filter(d => getPhaseData(d).stage !== "Afterglow / Sober").map((dose) => {
                    const { stage, percentComplete, gradient, textColor, pulse, durationMins, icon } = getPhaseData(dose);
                    return (
                      <motion.div
                        key={dose.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="relative p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg text-white flex items-center gap-2">
                              {dose.substance}
                              {durationMins < 60 && <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />}
                            </h4>
                            <p className="text-xs text-gray-400 font-mono">
                              <span className="text-[hsl(var(--neon-purple))] font-bold mr-1">{dose.route}</span> 
                              • {format(new Date(dose.doseTime), "h:mm a")} • {dose.quantity}{dose.unit}
                            </p>
                          </div>
                          <div className={`flex items-center gap-2 text-xs font-black px-2 py-1 rounded bg-black/50 border border-white/10 uppercase ${textColor}`}>
                            {icon} {stage}
                          </div>
                        </div>

                        {/* PROGRESS BAR */}
                        <div className="w-full h-4 bg-gray-900/80 rounded-full mt-3 overflow-hidden border border-white/5 shadow-inner relative">
                          <motion.div 
                            className={`h-full ${gradient} relative`} 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentComplete}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          >
                            {pulse && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                          </motion.div>
                        </div>
                        
                        <div className="flex justify-between mt-2 text-xs font-mono">
                           <span className="text-gray-500">T+ {formatDistanceToNow(new Date(dose.doseTime))}</span>
                           <span className="text-gray-500">{Math.round(percentComplete)}%</span>
                        </div>

                        <button onClick={() => deleteDose(dose.id)} className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* === HISTORY TAB === */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Logbook</h3>
              <button onClick={() => setDoses([])} className="text-xs text-red-400 hover:text-red-300 underline">Clear All</button>
            </div>
            <div className="space-y-2">
              {doses.length === 0 ? (
                <div className="text-center py-10 text-gray-600">History is empty.</div>
              ) : (
                doses.map((dose) => (
                  <div key={dose.id} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-800 rounded-full">
                        <History className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{dose.substance}</p>
                        <p className="text-xs text-gray-500 font-mono">
                           <span className="text-[hsl(var(--neon-purple))] mr-1">{dose.route}</span> 
                           • {format(new Date(dose.doseTime), "PPP p")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-mono text-[hsl(var(--neon-green))]">{dose.quantity}{dose.unit}</span>
                      <button onClick={() => deleteDose(dose.id)} className="text-xs text-red-500/50 hover:text-red-500 mt-1">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* === TOLERANCE TAB === */}
        {activeTab === 'tolerance' && (
           <div className="flex flex-col p-2 gap-4 animate-fadeIn">
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                 <label className="text-[10px] text-[hsl(var(--neon-purple))] font-bold tracking-wider block mb-1">
                   LAST DOSE
                 </label>
                 <div className="flex items-center gap-2">
                   <input
                     type="number"
                     value={lastDose}
                     onChange={(e) => setLastDose(Number(e.target.value))}
                     className="w-full bg-transparent border-b border-white/20 text-[hsl(var(--neon-green))] font-mono text-lg outline-none focus:border-[hsl(var(--neon-green))]"
                   />
                   <span className="text-xs text-[hsl(var(--neon-purple))] font-mono">
                     μg/mg
                   </span>
                 </div>
               </div>
               <div className="bg-black/40 border border-white/10 rounded-lg p-3">
                 <label className="text-[10px] text-[hsl(var(--neon-purple))] font-bold tracking-wider block mb-1">
                   DAYS AGO
                 </label>
                 <input
                   type="number"
                   value={days}
                   onChange={(e) => setDays(Number(e.target.value))}
                   className="w-full bg-transparent border-b border-white/20 text-[hsl(var(--neon-green))] font-mono text-lg outline-none focus:border-[hsl(var(--neon-green))]"
                 />
               </div>
               <div className="col-span-2 bg-black/40 border border-white/10 rounded-lg p-3">
                 <label className="text-[10px] text-[hsl(var(--neon-purple))] font-bold tracking-wider block mb-1">
                   DESIRED DOSE
                 </label>
                 <div className="flex items-center gap-2">
                   <input
                     type="number"
                     value={desiredDose}
                     onChange={(e) => setDesiredDose(Number(e.target.value))}
                     className="w-full bg-transparent border-b border-white/20 text-[hsl(var(--neon-green))] font-mono text-lg outline-none focus:border-[hsl(var(--neon-green))]"
                   />
                   <span className="text-xs text-[hsl(var(--neon-purple))] font-mono">
                     μg/mg
                   </span>
                 </div>
               </div>
             </div>
             <div className="flex-1 bg-black/40 border border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[200px]">
               <div className="absolute inset-0 bg-[hsl(var(--neon-purple))/10] blur-xl group-hover:bg-[hsl(var(--neon-purple))/20] transition-colors" />
               <span className="relative z-10 text-xl font-bold text-[hsl(var(--neon-green))] font-mono tracking-widest mb-2">
                 YOU NEED TO TAKE
               </span>
               <div className="relative z-10 flex items-baseline gap-2">
                 <span className="text-4xl font-black text-[hsl(var(--neon-green))] drop-shadow-[0_0_10px_hsl(var(--neon-purple))]">
                   {Math.round(tolResult)}
                 </span>
                 <span className="text-xl font-mono font-bold text-[hsl(var(--neon-purple))]">
                   μg/mg
                 </span>
               </div>
               <span className="relative z-10 text-xs text-[hsl(var(--neon-green))] font-mono tracking-widest mb-2 mt-4 text-center px-4">
                 To feel the same effects as
               </span>
               <span className="whitespace-nowrap z-10">
                 <span className="text-2xl font-bold text-[hsl(var(--neon-green))] drop-shadow-[0_0_20px_hsl(var(--neon-purple))]">
                   {desiredDose}
                 </span>
                 <span className="text-sm font-bold text-[hsl(var(--neon-purple))] ml-1">
                   μg/mg
                 </span>
               </span>
             </div>
             <motion.div
               className="text-[10px] text-center font-mono opacity-60"
               animate={{
                 color: ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ff0000"],
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             >
               *Approximation based on standard tryptamine tolerance models.
             </motion.div>
           </div>
        )}

      </div>
    </GlassCard>
  );
};