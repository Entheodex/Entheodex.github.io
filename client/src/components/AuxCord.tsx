import React, { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { MeltText } from "./ui/MeltText";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  FileCode,
  Map,
  TableProperties,
  Search,
  Link,
  Box,
  Atom,
  Binary,
  Workflow,
  ListChecks
} from "lucide-react";

export function AuxCord() {
  // State to track active tab
  const [activeTab, setActiveTab] = useState<'map' | 'index' | 'structures'>('map');

  // Animation variants for tab content transition
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    // Fixed height container with overflow handling
    <GlassCard glowColor="purple" className="flex flex-col h-[700px] relative overflow-hidden">

      {/* --- HEADER SECTION --- */}
      <div className="p-6 border-b border-white/10 bg-black/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[hsl(var(--neon-purple)/0.1)] border border-[hsl(var(--neon-purple)/0.2)] animate-pulse-slow">
            <Database className="w-8 h-8 text-[hsl(var(--neon-purple))]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-3xl font-black tracking-tighter text-white">
              {/* @ts-ignore */}
              <MeltText text="DATA" />
              <span className="text-[hsl(var(--neon-cyan))]">
                {/* @ts-ignore */}
                <MeltText text="NEXUS" />
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              Core DrugBank Asset Documentation
            </p>
          </div>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex mt-6 gap-2 p-1 bg-black/40 rounded-xl">
          {(['map', 'index', 'structures'] as const).map((tab) => {
            // Determine colors based on tab name for visual distinction
            let activeColor = "text-[hsl(var(--neon-purple))] shadow-[0_0_15px_hsl(var(--neon-purple)/0.3)]";
            let icon = <FileCode className="w-4 h-4"/>;
            let label = "The Map (XSD)";

            if (tab === 'index') {
                activeColor = "text-[hsl(var(--neon-cyan))] shadow-[0_0_15px_hsl(var(--neon-cyan)/0.3)]";
                icon = <TableProperties className="w-4 h-4"/>;
                label = "The Index (CSV)";
            } else if (tab === 'structures') {
                activeColor = "text-[hsl(var(--neon-green))] shadow-[0_0_15px_hsl(var(--neon-green)/0.3)]";
                icon = <Box className="w-4 h-4"/>;
                label = "The Structures (SDF)";
            }

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? `bg-white/10 ${activeColor}`
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {icon}
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <AnimatePresence mode="wait">

          {/* === TAB 1: THE MAP (XSD) === */}
          {activeTab === 'map' && (
            <motion.div
              key="map"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="bg-[hsl(var(--neon-purple)/0.05)] border border-[hsl(var(--neon-purple)/0.2)] p-4 rounded-xl mb-4">
                <h2 className="text-xl font-bold text-[hsl(var(--neon-purple))] mb-2 flex items-center gap-2">
                  <FileCode className="w-5 h-5" /> drugbank.xsd
                </h2>
                <p className="text-gray-300 text-sm italic">XML Schema Definition - "The Blueprint"</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex items-start gap-4">
                  <Map className="w-8 h-8 text-[hsl(var(--neon-purple))] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">Defines Data Structure</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      This file contains no drug data. Instead, it is a rigid schema defining the hierarchy and data types for a valid DrugBank XML file, specifying elements like `drug-interaction`, `target`, and required fields.
                    </p>
                  </div>
                </div>
                <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex items-start gap-4">
                  <ListChecks className="w-8 h-8 text-[hsl(var(--neon-purple))] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-2 text-lg">Validation & Parsing</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Crucial for validating XML datasets to ensure integrity before import. It is also used to automatically generate code classes (e.g., in Python or Java) for parsing the full database.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* === TAB 2: THE INDEX (CSV) === */}
          {activeTab === 'index' && (
            <motion.div
              key="index"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
               <div className="bg-[hsl(var(--neon-cyan)/0.05)] border border-[hsl(var(--neon-cyan)/0.2)] p-4 rounded-xl mb-4">
                <h2 className="text-xl font-bold text-[hsl(var(--neon-cyan))] mb-2 flex items-center gap-2">
                  <TableProperties className="w-5 h-5" /> drugbank vocabulary.csv
                </h2>
                <p className="text-gray-300 text-sm italic">Comma-Separated Values - "The Lookup Table"</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex items-start gap-4">
                    <Search className="w-8 h-8 text-[hsl(var(--neon-cyan))] shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-white mb-2 text-lg">Quick Search Index</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            A lightweight table ideally suited for building search bars and autocomplete features. It allows for fast lookup of a drug's master `DrugBank ID` using its common name or synonyms.
                        </p>
                    </div>
                 </div>
                 <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex items-start gap-4">
                    <Link className="w-8 h-8 text-[hsl(var(--neon-cyan))] shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-white mb-2 text-lg">External Identifier Mapping</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Acts as a "Rosetta Stone," linking DrugBank IDs to other major databases through standard identifiers included in the file, such as `CAS` numbers, `UNII` codes, and `Standard InChI Keys`.
                        </p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* === TAB 3: THE STRUCTURES (SDF) === */}
          {activeTab === 'structures' && (
            <motion.div
              key="structures"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
               <div className="bg-[hsl(var(--neon-green)/0.05)] border border-[hsl(var(--neon-green)/0.2)] p-4 rounded-xl mb-4">
                <h2 className="text-xl font-bold text-[hsl(var(--neon-green))] mb-2 flex items-center gap-2">
                  <Box className="w-5 h-5" /> open structures.sdf
                </h2>
                <p className="text-gray-300 text-sm italic">Structure-Data File - "The 3D Models"</p>
              </div>

               <div className="flex flex-col gap-4">
                 <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-black/50 rounded-lg">
                             <Atom className="w-8 h-8 text-[hsl(var(--neon-green))] group-hover:animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">3D Visualization Data</h3>
                            <p className="text-sm text-gray-400">Contains the precise atomic coordinates (x, y, z) and bonding information required to render interactive 3D models of each drug molecule in visualization software.</p>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-black/50 rounded-lg">
                             <Binary className="w-8 h-8 text-[hsl(var(--neon-green))]" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Cheminformatics & Linking</h3>
                            {/* FIXED LINE BELOW: Escaped brackets using &lt; and &gt; */}
                            <p className="text-sm text-gray-400">Used for calculating molecular properties and performing structural analysis. Each entry is embedded with its corresponding &lt;DRUGBANK_ID&gt;, linking it back to the other data files.</p>
                        </div>
                    </div>
                 </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </GlassCard>
  );
}