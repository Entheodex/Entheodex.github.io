import React, { useState, useMemo } from 'react';
import { MeltText } from './ui/MeltText';
import drugsData from '../data/drugs.json';
import combosData from '../data/combos.json';
import comboDefsData from '../data/combo_definitions.json';
import { Database, Search, FlaskConical, AlertTriangle, Skull, ShieldCheck, Zap } from 'lucide-react';

// --- Types ---
interface DrugEntry {
  name: string;
  pretty_name: string;
  categories: string[];
  formatted_dose?: Record<string, Record<string, string>>;
  properties?: {
    summary?: string;
    duration?: string;
    onset?: string;
    "after-effects"?: string;
  };
}

interface InteractionData {
  status: string;
  note?: string;
}

interface InteractionDisplay {
  name: string;
  prettyName: string;
  status: string;
  note?: string;
  color: string;
  emoji: string;
  rank: number;
}

// --- Constants ---
const STATUS_RANK: Record<string, number> = {
  "Dangerous": 0,
  "Unsafe": 1,
  "Caution": 2,
  "Low Risk & Synergy": 3,
  "Low Risk & No Synergy": 4,
  "Low Risk & Decrease": 5
};

const STATUS_CONFIG: Record<string, { color: string, icon: React.ReactNode, label: string }> = {
  "Dangerous": { color: "text-red-500 border-red-500/50 bg-red-500/10", icon: <Skull className="w-5 h-5" />, label: "DANGEROUS" },
  "Unsafe": { color: "text-orange-400 border-orange-400/50 bg-orange-400/10", icon: <AlertTriangle className="w-5 h-5" />, label: "UNSAFE" },
  "Caution": { color: "text-yellow-400 border-yellow-400/50 bg-yellow-400/10", icon: <AlertTriangle className="w-5 h-5" />, label: "CAUTION" },
  "Low Risk & Synergy": { color: "text-blue-400 border-blue-400/50 bg-blue-400/10", icon: <Zap className="w-5 h-5" />, label: "SYNERGY" },
  "Low Risk & No Synergy": { color: "text-green-400 border-green-400/50 bg-green-400/10", icon: <ShieldCheck className="w-5 h-5" />, label: "LOW RISK" },
  "Low Risk & Decrease": { color: "text-cyan-400 border-cyan-400/50 bg-cyan-400/10", icon: <ShieldCheck className="w-5 h-5" />, label: "DECREASE" },
};

// --- Helper Functions ---
const normalizeCategory = (cat: string) => {
  const lower = cat.toLowerCase();
  const pluralMap: Record<string, string> = {
    'benzodiazepine': 'benzodiazepines',
    'amphetamine': 'amphetamines',
    'opioid': 'opioids',
    'ssri': 'ssris',
    'maoi': 'maois',
    'cannabinoid': 'cannabis'
  };
  return pluralMap[lower] || lower;
};

const getPrettyName = (slug: string) => {
  if ((drugsData as any)[slug]) return (drugsData as any)[slug].pretty_name;
  if (slug === "benzodiazepines") return "Benzos";
  if (slug === "amphetamines") return "Amphetamines";
  if (slug === "opioids") return "Opioids";
  if (slug === "ssris") return "SSRIs";
  if (slug === "maois") return "MAOIs";
  if (slug === "cannabis") return "Weed/Cannabis";
  if (slug === "alcohol") return "Alcohol";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

// --- Styles ---
const glassStyle = {
  background: 'rgba(20, 20, 30, 0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
};

export const Kaleidoscope: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dosage' | 'interaction'>('dosage');
  const [selectedDosageDrug, setSelectedDosageDrug] = useState<string>('');
  const [selectedInteractionDrug, setSelectedInteractionDrug] = useState<string>('');

  const drugList = useMemo(() => {
    return Object.entries(drugsData as Record<string, DrugEntry>)
      .map(([key, data]) => ({ key, name: data.pretty_name || data.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const currentDrug = selectedDosageDrug ? (drugsData as Record<string, DrugEntry>)[selectedDosageDrug] : null;

  // --- INTERACTION LOGIC ---
  const interactionList = useMemo(() => {
    if (!selectedInteractionDrug) return [];

    const drugKey = selectedInteractionDrug;
    const drugEntry = (drugsData as Record<string, DrugEntry>)[drugKey];
    
    let comboSourceKey = "";
    if ((combosData as any)[drugKey]) {
      comboSourceKey = drugKey;
    } else if (drugEntry?.categories) {
      for (const cat of drugEntry.categories) {
        const norm = normalizeCategory(cat);
        if ((combosData as any)[norm]) {
          comboSourceKey = norm;
          break;
        }
      }
    }

    if (!comboSourceKey) return [];

    const interactionsRaw = (combosData as any)[comboSourceKey] as Record<string, InteractionData>;
    if (!interactionsRaw) return [];

    const list: InteractionDisplay[] = Object.entries(interactionsRaw).map(([targetSlug, data]) => {
      const status = data.status || "Unknown";
      const config = STATUS_CONFIG[status] || { color: "text-gray-400", icon: null, label: status };
      
      return {
        name: targetSlug,
        prettyName: getPrettyName(targetSlug),
        status: status,
        note: data.note,
        color: config.color,
        emoji: "",
        rank: STATUS_RANK[status] ?? 99
      };
    });

    return list.sort((a, b) => a.rank - b.rank);
  }, [selectedInteractionDrug]);


  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 rounded-3xl text-white transition-all duration-300 min-h-[600px]" style={glassStyle}>
      
      {/* --- INFO-DEX HEADER --- */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-[hsl(var(--neon-cyan)/0.1)]">
            <Database className="w-6 h-6 text-[hsl(var(--neon-purple))]" />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white">
            {/* @ts-ignore */}
            <MeltText text="INFO-DEX" />
          </div>
        </div>
        <p className="text-xs text-gray-400 font-mono tracking-[0.3em] uppercase opacity-70 pl-1">
          Harm Reduction Database & Interaction Analyzer
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center space-x-2 md:space-x-6 mb-8">
        <button
          onClick={() => setActiveTab('dosage')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold tracking-wide ${
            activeTab === 'dosage' 
              ? 'bg-white/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4" />
          Dosage & Info
        </button>
        <button
          onClick={() => setActiveTab('interaction')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold tracking-wide ${
            activeTab === 'interaction' 
              ? 'bg-white/10 text-pink-400 border border-pink-500/30 shadow-[0_0_15px_rgba(244,114,182,0.1)]' 
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          Interaction Report
        </button>
      </div>

      {/* --- DOSAGE TAB --- */}
      {activeTab === 'dosage' && (
        <div className="animate-fadeIn">
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Substance</label>
            <select
              value={selectedDosageDrug}
              onChange={(e) => setSelectedDosageDrug(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            >
              <option value="">-- Choose a substance --</option>
              {drugList.map((d) => (
                <option key={d.key} value={d.key}>{d.name}</option>
              ))}
            </select>
          </div>

          {currentDrug ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Timing Card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">⏱️ Timing</h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-gray-400">Onset</span>
                    <span className="text-cyan-100">{currentDrug.properties?.onset || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-cyan-100">{currentDrug.properties?.duration || "Unknown"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">After-effects</span>
                    <span className="text-cyan-100">{currentDrug.properties?.["after-effects"] || "Unknown"}</span>
                  </div>
                </div>
              </div>

              {/* Dosage Card */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">⚖️ Dosage</h3>
                {currentDrug.formatted_dose ? (
                  Object.entries(currentDrug.formatted_dose).map(([route, doses]) => (
                    <div key={route} className="mb-4 last:mb-0">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{route}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(doses).map(([level, amount]) => (
                          <div key={level} className="flex justify-between items-center bg-black/20 px-3 py-2 rounded border border-white/5">
                            <span className={`font-bold ${
                              level === 'Heavy' ? 'text-red-400' : 
                              level === 'Strong' ? 'text-orange-400' : 
                              level === 'Common' ? 'text-green-400' : 'text-blue-300'
                            }`}>{level}</span>
                            <span className="font-mono text-gray-300">{amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No structured dosage data available.</p>
                )}
              </div>

              {/* Summary */}
              <div className="md:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Summary</h3>
                <p className="text-gray-300 leading-relaxed text-sm mb-4">
                  {currentDrug.properties?.summary || "No summary available."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentDrug.categories?.map(cat => (
                    <span key={cat} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Select a substance to view BioClock and Dosage data.</p>
            </div>
          )}
        </div>
      )}

      {/* --- INTERACTION REPORT DASHBOARD --- */}
      {activeTab === 'interaction' && (
        <div className="animate-fadeIn">
          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Analyze Substance</label>
            <select
              value={selectedInteractionDrug}
              onChange={(e) => setSelectedInteractionDrug(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-pink-500 transition-colors font-mono text-lg"
            >
              <option value="">-- Choose a substance to generate report --</option>
              {drugList.map((d) => (
                <option key={d.key} value={d.key}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="min-h-[200px]">
            {selectedInteractionDrug ? (
              interactionList.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-pink-400">Interaction Report</h3>
                     <span className="text-xs text-gray-500 font-mono bg-black/30 px-2 py-1 rounded border border-white/5">
                        {interactionList.length} interactions found
                     </span>
                  </div>
                  
                  {/* SCROLLABLE CONTAINER */}
                  <div className="max-h-[1050px] overflow-y-auto custom-scrollbar pr-2">
                    <div className="grid gap-3 max-w-[400px]">
                      {interactionList.map((item, idx) => (
                        <div 
                          key={idx}
                          className={`p-4 rounded-xl border flex flex-col md:flex-row gap-2 items-start md:items-center ${item.color} bg-opacity-10 backdrop-blur-sm transition-all hover:scale-[1.01]`}
                        >
                           {/* Status Icon & Label */}
                           <div className="flex-shrink-0 flex items-center gap-3 w-28">
                              {STATUS_CONFIG[item.status]?.icon || <FlaskConical className="w-5 h-5" />}
                              <span className="font-black tracking-widest text-xs uppercase">{STATUS_CONFIG[item.status]?.label || item.status}</span>
                           </div>

                           {/* Drug Name */}
                           <div className="flex-1 font-bold text-lg text-white">
                             {item.prettyName}
                           </div>

                           {/* Note */}
                           {item.note && (
                             <div className="flex-[2] text-xs text-white/70 leading-relaxed border-l border-white/10 pl-4">
                               {item.note}
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No interaction data found for this substance category.</p>
                </div>
              )
            ) : (
              <div className="text-gray-500 italic flex flex-col items-center py-10">
                <FlaskConical className="w-12 h-12 mb-3 opacity-20" />
                Select a substance to scan the database for interactions.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};