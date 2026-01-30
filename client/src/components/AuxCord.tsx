import React, { useState, useMemo } from "react";
import { GlassCard } from "./ui/GlassCard";
import { MeltText } from "./ui/MeltText";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  ChevronDown,
  FlaskConical,
  BrainCircuit,
  MapPin,
  Leaf,
  Info,
  Scroll,
  Bug,
  Ghost,
  Sprout,
  Droplets
} from "lucide-react";

// --- DATA SOURCE: EXTRACTED FROM WIKITEXT ---
const RITUAL_SUBSTANCES = [
  // --- ANIMALS ---
  {
    name: "Bullet ant venom",
    species: "Paraponera clavata",
    compounds: "Poneratoxin",
    effect: "Deliriant",
    region: "Amazon (Satere-Mawe)",
    notes: "Used in initiation rites. Initiates endure hundreds of stings causing extreme pain."
  },
  {
    name: "Colorado River toad",
    species: "Incilius alvarius",
    compounds: "5-MeO-DMT, Bufotenin",
    effect: "Psychedelic",
    region: "Sonoran Desert",
    notes: "Secretion contains extremely potent psychoactive tryptamines. Gained popularity in spiritual retreats."
  },
  {
    name: "Kambo (Sapo)",
    species: "Phyllomedusa bicolor",
    compounds: "Deltorphin, Dermorphin (Opioids)",
    effect: "Depressant / Purgative",
    region: "Amazon Rainforest",
    notes: "Used for 'cleansing' rituals. Induces intense purging and vomiting."
  },

  // --- MUSHROOMS ---
  {
    name: "Dictyonema huaorani",
    species: "Dictyonema huaorani",
    compounds: "5-MeO-DMT, DMT, Psilocybin",
    effect: "Psychedelic",
    region: "Amazon (Ecuador)",
    notes: "A rare lichenized basidiomycete used by Waorani shamans."
  },
  {
    name: "Fly Agaric",
    species: "Amanita muscaria",
    compounds: "Muscimol, Ibotenic acid",
    effect: "Depressant / Dissociative",
    region: "Siberia / Scandinavia",
    notes: "The iconic red-and-white mushroom. Siberian shamans traditionally recycled the active compounds through urine."
  },
  {
    name: "Psilocybin Mushroom",
    species: "Psilocybe spp.",
    compounds: "Psilocybin, Psilocin, Baeocystin",
    effect: "Psychedelic",
    region: "Mesoamerica (Mazatec)",
    notes: "Known as Teonanácatl ('Flesh of the Gods'). Used in veladas for healing and divination."
  },

  // --- PLANTS (Psychoactive) ---
  {
    name: "Angel's Trumpet",
    species: "Brugmansia spp.",
    compounds: "Tropane alkaloids (Scopolamine)",
    effect: "Deliriant",
    region: "South America",
    notes: "Extremely dangerous. Used by shamans for sorcery or divination. Sometimes an Ayahuasca admixture."
  },
  {
    name: "Ayahuasca",
    species: "Banisteriopsis caapi",
    compounds: "Harmine, Tetrahydroharmine (MAOIs)",
    effect: "Psychedelic (Enabler)",
    region: "Amazon Basin (UDV, Santo Daime)",
    notes: "The vine itself. It enables oral DMT activity. Often mixed with Chacruna."
  },
  {
    name: "Bolivian Torch",
    species: "Echinopsis lageniformis",
    compounds: "Mescaline",
    effect: "Psychedelic",
    region: "South America",
    notes: "Fast-growing cactus containing mescaline."
  },
  {
    name: "Takini",
    species: "Brosimum acutifolium",
    compounds: "Bufotenin",
    effect: "Psychedelic",
    region: "Guiana Plateau",
    notes: "Latex from the tree is used as a shamanic potion."
  },
  {
    name: "Cannabis",
    species: "Cannabis sativa",
    compounds: "THC, CBD",
    effect: "Psychedelic / Psychoactive",
    region: "Global (India, Rastafari)",
    notes: "Sacred to Shiva (Bhang). Sacrament in Rastafari and newer cannabis churches."
  },
  {
    name: "Chacruna",
    species: "Psychotria viridis",
    compounds: "DMT",
    effect: "Psychedelic",
    region: "Amazon (UDV, Santo Daime)",
    notes: "The primary light-bearing (DMT) leaf used in the Ayahuasca brew."
  },
  {
    name: "Chaliponga",
    species: "Diplopterys cabrerana",
    compounds: "5-MeO-DMT, Bufotenin, DMT",
    effect: "Psychedelic",
    region: "Amazon (Brazil, Colombia)",
    notes: "Often used as an alternative or additive to Chacruna in Ayahuasca."
  },
  {
    name: "Christmasvine",
    species: "Turbina corymbosa",
    compounds: "LSA, Ergoline derivatives",
    effect: "Psychedelic",
    region: "Mexico (Mazatec)",
    notes: "Also known as Ololiuqui. Seeds used for divination."
  },
  {
    name: "Syrian Rue (Harmal)",
    species: "Peganum harmala",
    compounds: "Harmaline, Harmala alkaloids",
    effect: "Psychedelic / MAOI",
    region: "Iran / Middle East",
    notes: "Seeds burned as incense (Esphand) or used as an MAOI source."
  },
  {
    name: "Hawaiian Baby Woodrose",
    species: "Argyreia nervosa",
    compounds: "LSA (Ergoline derivatives)",
    effect: "Psychedelic",
    region: "Hawaii (Huna)",
    notes: "Seeds contain lysergic acid amides. Used by Huna shamans."
  },
  {
    name: "Henbane",
    species: "Hyoscyamus niger",
    compounds: "Hyoscyamine, Scopolamine",
    effect: "Deliriant",
    region: "Ancient Greece / Medieval Europe",
    notes: "Associated with witches' flying ointments and the Oracle of Delphi."
  },
  {
    name: "Iboga",
    species: "Tabernanthe iboga",
    compounds: "Ibogaine",
    effect: "Psychedelic / Oneirogen",
    region: "Gabon (Bwiti)",
    notes: "Root bark used in initiation rites to visit ancestors. Anti-addictive properties."
  },
  {
    name: "Jimsonweed",
    species: "Datura stramonium",
    compounds: "Atropine, Scopolamine",
    effect: "Deliriant",
    region: "Americas (Algonquin, Navajo)",
    notes: "Used in initiation ceremonies (wysoccan). Extremely toxic and disorienting."
  },
  {
    name: "Jurema",
    species: "Mimosa tenuiflora",
    compounds: "DMT, Yuremamine",
    effect: "Psychedelic",
    region: "Brazil (Jurema Cult)",
    notes: "Root bark used in 'Vinho da Jurema'."
  },
  {
    name: "Labrador Tea",
    species: "Rhododendron spp.",
    compounds: "Ledol, Grayanotoxins",
    effect: "Deliriant",
    region: "Caucasus",
    notes: "Used by peasants in shamanistic rituals."
  },
  {
    name: "Mad Honey",
    species: "Rhododendron ponticum (nectar)",
    compounds: "Grayanotoxins",
    effect: "Deliriant",
    region: "Nepal (Gurung people)",
    notes: "Honey made from toxic rhododendron nectar. Hallucinogenic and medicinal."
  },
  {
    name: "Morning Glory",
    species: "Ipomoea tricolor",
    compounds: "LSA, Ergoline derivatives",
    effect: "Psychedelic",
    region: "Mexico (Zapotec)",
    notes: "Seeds used for divination. 13 seeds is a ritual number."
  },
  {
    name: "Nyakwána",
    species: "Virola elongata",
    compounds: "DMT, 5-MeO-DMT",
    effect: "Psychedelic",
    region: "Amazon (Yanomami)",
    notes: "Resin is dried and snuffed to commune with spirits."
  },
  {
    name: "San Pedro",
    species: "Trichocereus macrogonus (Echinopsis)",
    compounds: "Mescaline",
    effect: "Psychedelic",
    region: "Andes",
    notes: "Sacred cactus used by Curanderos for thousands of years."
  },
  {
    name: "Peyote",
    species: "Lophophora williamsii",
    compounds: "Mescaline",
    effect: "Psychedelic",
    region: "North America (NAC)",
    notes: "Spineless cactus used as a sacrament in the Native American Church."
  },
  {
    name: "Salvia",
    species: "Salvia divinorum",
    compounds: "Salvinorin A",
    effect: "Atypical Psychedelic",
    region: "Oaxaca (Mazatec)",
    notes: "Leaves chewed or smoked. Embodies the spirit 'Ska María Pastora'."
  },
  {
    name: "Vilca",
    species: "Anadenanthera colubrina",
    compounds: "Bufotenin, 5-MeO-DMT",
    effect: "Psychedelic",
    region: "Southern Andes (Wari)",
    notes: "Seeds used as snuff. Historically mixed with Chicha (alcohol)."
  },
  {
    name: "Yopo",
    species: "Anadenanthera peregrina",
    compounds: "5-MeO-DMT, Bufotenin",
    effect: "Psychedelic",
    region: "Orinoco Basin",
    notes: "Potent snuff blown into nostrils using a bird-bone pipe."
  },

  // --- CHEMICALS ---
  {
    name: "2C-B",
    species: "Synthetic (Phenethylamine)",
    compounds: "4-Bromo-2,5-dimethoxyphenylethanamine",
    effect: "Psychedelic",
    region: "South Africa (Sangoma)",
    notes: "Used by some healers as 'Ubulawu Nomathotholo' (Medicine of the Singing Ancestors)."
  },
  {
    name: "DPT",
    species: "Synthetic (Tryptamine)",
    compounds: "Dipropyltryptamine",
    effect: "Psychedelic",
    region: "Temple of the True Inner Light",
    notes: "Used as a religious sacrament to manifest God."
  },
  {
    name: "Ketamine",
    species: "Synthetic (Arylcyclohexylamine)",
    compounds: "Ketamine",
    effect: "Dissociative",
    region: "Therapeutic / Spiritual",
    notes: "Used for death-rebirth psychotherapy and thanatological preparation."
  },
  {
    name: "LSD",
    species: "Semi-synthetic (Ergoline)",
    compounds: "Lysergic acid diethylamide",
    effect: "Psychedelic",
    region: "Neo-American Church / League for Spiritual Discovery",
    notes: "Central sacrament of 1960s psychedelic churches."
  },
  {
    name: "MDMA",
    species: "Synthetic (Amphetamine)",
    compounds: "3,4-Methyl​enedioxy​methamphetamine",
    effect: "Entactogen",
    region: "Modern Spiritual Circles",
    notes: "Used to enhance prayer, meditation, and trauma healing."
  },

  // --- NON-PSYCHEDELIC RITUAL PLANTS ---
  {
    name: "African Dream Root",
    species: "Silene undulata",
    compounds: "Triterpenoid saponins",
    effect: "Oneirogen",
    region: "South Africa (Xhosa)",
    notes: "Used to induce vivid prophetic dreams."
  },
  {
    name: "Aztec Tobacco",
    species: "Nicotiana rustica",
    compounds: "Nicotine (High dose), Beta-carbolines",
    effect: "Stimulant",
    region: "Americas (Mapacho)",
    notes: "Used for grounding, protection, and clearing energy. Much stronger than common tobacco."
  },
  {
    name: "Blue Water Lily",
    species: "Nymphaea caerulea",
    compounds: "Aporphine, Nuciferine",
    effect: "Depressant",
    region: "Ancient Egypt / Maya",
    notes: "Depicted in ancient art. Mildly sedative and psychoactive."
  },
  {
    name: "Cacao",
    species: "Theobroma cacao",
    compounds: "Theobromine, Caffeine",
    effect: "Stimulant",
    region: "Mesoamerica (Aztec/Maya)",
    notes: "Food of the Gods. Used in rituals, sometimes mixed with psilocybin."
  },
  {
    name: "Coffee",
    species: "Coffea spp.",
    compounds: "Caffeine",
    effect: "Stimulant",
    region: "Yemen (Sufi)",
    notes: "Originally used by Sufi monks to stay awake for midnight prayers and chanting."
  },
  {
    name: "Kava",
    species: "Piper methysticum",
    compounds: "Kavalactones",
    effect: "Depressant",
    region: "Oceania (Fiji, Vanuatu)",
    notes: "Sacred social drink. Used to settle disputes and commune with spirits."
  },
  {
    name: "Kratom",
    species: "Mitragyna speciosa",
    compounds: "Mitragynine, 7-OH-Mitragynine",
    effect: "Depressant / Stimulant",
    region: "Thailand",
    notes: "Used in worship of ancestors and gods."
  },
  {
    name: "Opium",
    species: "Papaver somniferum",
    compounds: "Morphine, Codeine",
    effect: "Depressant",
    region: "Ancient Greece / Egypt",
    notes: "Sacred to Demeter, Hypnos, and Thoth. Symbol of eternal sleep/oblivion."
  },
  {
    name: "Tea",
    species: "Camellia sinensis",
    compounds: "Caffeine, Theanine",
    effect: "Stimulant",
    region: "East Asia (Buddhist)",
    notes: "Used by monks for mindful alertness during meditation."
  },

  // --- ALCOHOL ---
  {
    name: "Alcohol (General)",
    species: "Fermented Yeast",
    compounds: "Ethanol",
    effect: "Depressant",
    region: "Global",
    notes: "Used in Eucharist, Kiddush, Libations, and Ofrendas."
  },
  {
    name: "Chicha",
    species: "Zea mays (Corn)",
    compounds: "Ethanol",
    effect: "Depressant",
    region: "Inca Empire",
    notes: "Sacred corn beer reserved for cherished ceremonies."
  },
  {
    name: "Mead",
    species: "Fermented Honey",
    compounds: "Ethanol",
    effect: "Depressant",
    region: "Norse Religion",
    notes: "Central to Yule, Midsummer, and Blót sacrifices."
  },
  {
    name: "Pulque",
    species: "Agave spp.",
    compounds: "Ethanol",
    effect: "Depressant",
    region: "Mesoamerica",
    notes: "Sacred drink of the Aztecs, later lost ritual meaning post-conquest."
  },
  {
    name: "Sake (Omiki)",
    species: "Fermented Rice",
    compounds: "Ethanol",
    effect: "Depressant",
    region: "Japan (Shinto)",
    notes: "Served to gods as offerings prior to drinking."
  }
];

export function AuxCord() {
  const [selectedItem, setSelectedItem] = useState<typeof RITUAL_SUBSTANCES[0] | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper to determine icon based on substance type/effect
  const getIcon = (item: typeof RITUAL_SUBSTANCES[0]) => {
    if (item.compounds.includes("venom") || item.species.includes("Toad") || item.species.includes("Ant")) return <Bug className="w-6 h-6 text-orange-500" />;
    if (item.species.includes("Fungi") || item.species.includes("Amanita") || item.species.includes("Psilocybe") || item.species.includes("Dictyonema")) return <Sprout className="w-6 h-6 text-pink-500" />;
    if (item.effect.includes("Alcohol") || item.compounds.includes("Ethanol")) return <Droplets className="w-6 h-6 text-blue-400" />;
    if (item.species.includes("Synthetic")) return <FlaskConical className="w-6 h-6 text-purple-400" />;
    return <Leaf className="w-6 h-6 text-green-400" />;
  };

  return (
    <GlassCard glowColor="purple" className="flex flex-col h-[700px] relative overflow-hidden transition-all duration-500">
      
      {/* --- HEADER --- */}
      <div className="p-6 border-b border-white/10 bg-black/20 shrink-0 z-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[hsl(var(--neon-purple)/0.1)] border border-[hsl(var(--neon-purple)/0.2)]">
            <Database className="w-8 h-8 text-[hsl(var(--neon-purple))]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-3xl font-black tracking-tighter text-white">
              {/* @ts-ignore */}
              <MeltText text="RITUAL" />
              <span className="text-[hsl(var(--neon-cyan))]">
                {/* @ts-ignore */}
                <MeltText text="ARCHIVE" />
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              Wiki Database: {RITUAL_SUBSTANCES.length} Entries
            </p>
          </div>
        </div>

        {/* --- CUSTOM DROPDOWN SELECTOR --- */}
        <div className="relative z-50">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-left transition-all hover:bg-white/5 hover:border-white/20 ${isDropdownOpen ? 'border-[hsl(var(--neon-purple))] shadow-[0_0_15px_hsl(var(--neon-purple)/0.3)]' : ''}`}
          >
            <span className={`font-mono font-bold ${selectedItem ? 'text-white' : 'text-gray-400'}`}>
              {selectedItem ? selectedItem.name : "Select a Substance..."}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[hsl(var(--neon-purple))]' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto custom-scrollbar bg-black/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl"
              >
                {RITUAL_SUBSTANCES.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-[hsl(var(--neon-purple)/0.2)] border-b border-white/5 last:border-0 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-gray-200 font-bold group-hover:text-white transition-colors">{item.name}</span>
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest group-hover:text-[hsl(var(--neon-cyan))] transition-colors">
                      {item.effect}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- CONTENT DISPLAY --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative">
        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key={selectedItem.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
               {/* Hero Section */}
               <div className="bg-[hsl(var(--neon-purple)/0.05)] border border-[hsl(var(--neon-purple)/0.2)] p-6 md:p-8 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     {/* Dynamic Background Icon based on type */}
                     {selectedItem.compounds.includes("Ethanol") ? <Droplets className="w-48 h-48" /> : <Ghost className="w-48 h-48" />}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        {getIcon(selectedItem)}
                        <span className="text-[10px] font-bold text-[hsl(var(--neon-purple))] uppercase tracking-[0.2em] border border-[hsl(var(--neon-purple)/0.5)] px-2 py-0.5 rounded-full">
                            {selectedItem.species}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                        {selectedItem.name}
                    </h2>
                  </div>
               </div>

               {/* Grid Layout */}
               <div className="grid md:grid-cols-2 gap-4">
                  {/* Region */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                          <MapPin className="w-4 h-4 text-orange-400" />
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Region / Culture</h3>
                      </div>
                      <p className="text-white text-lg font-medium">{selectedItem.region}</p>
                  </div>

                  {/* Effect */}
                  <div className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                          <BrainCircuit className="w-4 h-4 text-[hsl(var(--neon-green))]" />
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Effect Class</h3>
                      </div>
                      <p className="text-[hsl(var(--neon-green))] text-lg font-medium">{selectedItem.effect}</p>
                  </div>
                  
                  {/* Compounds */}
                  <div className="md:col-span-2 bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                          <FlaskConical className="w-4 h-4 text-[hsl(var(--neon-cyan))]" />
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phytochemicals / Compounds</h3>
                      </div>
                      <p className="text-[hsl(var(--neon-cyan))] font-mono">{selectedItem.compounds}</p>
                  </div>

                   {/* Notes */}
                   <div className="md:col-span-2 bg-black/40 border border-white/10 p-6 rounded-xl flex gap-4">
                      <Info className="w-6 h-6 text-gray-400 shrink-0 mt-1" />
                      <div>
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Archival Notes</h3>
                          <p className="text-gray-300 leading-relaxed">{selectedItem.notes}</p>
                      </div>
                   </div>
               </div>

            </motion.div>
          ) : (
            // EMPTY STATE
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 pointer-events-none">
              <Scroll className="w-32 h-32 mb-4 text-gray-500" />
              <h3 className="text-2xl font-bold text-gray-300">Select an Entry</h3>
              <p className="text-sm text-gray-500 mt-2">Open the dropdown above to access the ritual substance database.</p>
               
            </div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}