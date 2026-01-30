import React, { useState, useMemo } from "react";
import { GlassCard } from "./ui/GlassCard";
import { MeltText } from "./ui/MeltText";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sprout,
  FlaskConical,
  MapPin,
  BrainCircuit,
  Info,
  Leaf,
  Database,
  ChevronRight,
  Scroll
} from "lucide-react";

// --- THE ARCHIVE: Sourced from 'List of substances used in rituals' ---
const RITUAL_SUBSTANCES = [
  // --- AFRICA ---
  {
    vernacularName: "Iboga",
    species: "Tabernanthe iboga",
    phytochemicals: "Ibogaine, Ibogamine",
    effectClass: "Psychedelic / Oneirogen",
    regionCulture: "Gabon, Cameroon / Bwiti",
    notes: "Central to Bwiti initiation rites. Consumed in massive doses to induce a near-death experience and visit ancestors."
  },
  {
    vernacularName: "African Dream Root",
    species: "Silene undulata (capensis)",
    phytochemicals: "Triterpenoid saponins",
    effectClass: "Oneirogen",
    regionCulture: "South Africa / Xhosa",
    notes: "Roots are churned into a white froth ('ubulawu') and consumed to induce vivid, prophetic dreams."
  },
  {
    vernacularName: "African Dream Herb",
    species: "Entada rheedei",
    phytochemicals: "Saponins",
    effectClass: "Oneirogen",
    regionCulture: "South Africa / Traditional Healers",
    notes: "Large sea-beans. The meat is eaten or smoked to connect with the spirit world through sleep."
  },
  {
    vernacularName: "Imphepho",
    species: "Helichrysum odoratissimum",
    phytochemicals: "Diterpenes, Essential Oils",
    effectClass: "Mild Sedative / Trance Inducer",
    regionCulture: "South Africa / Zulu",
    notes: "Burnt as incense to clear bad energy and invite ancestors before casting bones."
  },
  {
    vernacularName: "Kwashi",
    species: "Pancratium tenuifolium",
    phytochemicals: "Alkaloids (Unspecified)",
    effectClass: "Psychedelic",
    regionCulture: "Botswana / Bushmen",
    notes: "Bulb used ritually to induce visual hallucinations, though specific pharmacological data is scarce."
  },

  // --- THE AMERICAS ---
  {
    vernacularName: "Ayahuasca",
    species: "Banisteriopsis caapi + Psychotria",
    phytochemicals: "Harmine, DMT",
    effectClass: "Entheogen / Psychedelic",
    regionCulture: "Amazon Basin / Indigenous Tribes",
    notes: "A brew combining an MAOI vine with a DMT leaf. Used for healing, divination, and spiritual cleansing."
  },
  {
    vernacularName: "Peyote",
    species: "Lophophora williamsii",
    phytochemicals: "Mescaline",
    effectClass: "Psychedelic",
    regionCulture: "Mexico, USA / Huichol, NAC",
    notes: "Sacred cactus used for millennia. The Native American Church uses it as a primary sacrament."
  },
  {
    vernacularName: "San Pedro (Wachuma)",
    species: "Echinopsis pachanoi",
    phytochemicals: "Mescaline",
    effectClass: "Psychedelic",
    regionCulture: "Andes / Curanderos",
    notes: "Used in mesa rituals to heal, find lost objects, and balance energy."
  },
  {
    vernacularName: "Psilocybin Mushrooms",
    species: "Psilocybe spp.",
    phytochemicals: "Psilocybin, Psilocin",
    effectClass: "Psychedelic",
    regionCulture: "Mesoamerica / Mazatec",
    notes: "Called 'Flesh of the Gods'. Used in veladas (night vigils) for healing and divination."
  },
  {
    vernacularName: "Salvia",
    species: "Salvia divinorum",
    phytochemicals: "Salvinorin A",
    effectClass: "Atypical Dissociative",
    regionCulture: "Oaxaca, Mexico / Mazatec",
    notes: "Chewed as fresh leaves (quid) for divination. The smoke is considered disrespectful by traditionalists."
  },
  {
    vernacularName: "Tobacco (Mapacho)",
    species: "Nicotiana rustica",
    phytochemicals: "Nicotine (High Potency)",
    effectClass: "Stimulant / Grounding Agent",
    regionCulture: "Americas / Shamanic Universal",
    notes: "Considered the 'grandfather' plant. Smoke is blown (soplada) to cleanse fields and protect participants."
  },
  {
    vernacularName: "Yopo (Cohoba)",
    species: "Anadenanthera peregrina",
    phytochemicals: "5-MeO-DMT, Bufotenin",
    effectClass: "Psychedelic",
    regionCulture: "Orinoco Basin / Yanomami",
    notes: "Seeds toasted and ground into snuff, blown into nostrils for violent purging and visionary states."
  },
  {
    vernacularName: "Vilca",
    species: "Anadenanthera colubrina",
    phytochemicals: "Bufotenin",
    effectClass: "Psychedelic",
    regionCulture: "Southern Andes / Tiwanaku",
    notes: "Historical snuff used by pre-Incan civilizations, often found with intricate snuff trays."
  },
  {
    vernacularName: "Ololiuqui",
    species: "Turbina corymbosa",
    phytochemicals: "LSA (Ergine)",
    effectClass: "Psychedelic",
    regionCulture: "Mexico / Aztec, Zapotec",
    notes: "Morning glory seeds. Used when mushrooms were unavailable for divination."
  },
  {
    vernacularName: "Sinicuichi",
    species: "Heimia salicifolia",
    phytochemicals: "Cryogenine",
    effectClass: "Auditory Hallucinogen",
    regionCulture: "Mexico / Traditional",
    notes: "Sun-fermented tea known as 'Sun Opener'. Causes yellow-tinted vision and auditory distortions."
  },
  {
    vernacularName: "Cacao",
    species: "Theobroma cacao",
    phytochemicals: "Theobromine, Caffeine",
    effectClass: "Stimulant / Empathogen",
    regionCulture: "Mesoamerica / Maya",
    notes: "Ritual drink of the elite. Often mixed with chili, vanilla, or psilocybin for ceremonies."
  },
  {
    vernacularName: "Guayusa",
    species: "Ilex guayusa",
    phytochemicals: "Caffeine, L-Theanine",
    effectClass: "Stimulant / Dream Recall",
    regionCulture: "Ecuador / Kichwa",
    notes: "Consumed at 3 AM ceremonies to interpret dreams and gain strength for the hunt."
  },
  {
    vernacularName: "Brugmansia (Toé)",
    species: "Brugmansia spp.",
    phytochemicals: "Scopolamine, Atropine",
    effectClass: "Deliriant",
    regionCulture: "South America / Shamanic",
    notes: "Extremely dangerous 'Angel's Trumpet'. Used only by master shamans for severe cases of sorcery."
  },
  {
    vernacularName: "Bufo / Toad",
    species: "Incilius alvarius",
    phytochemicals: "5-MeO-DMT",
    effectClass: "Psychedelic",
    regionCulture: "Sonora / Modern Shamanism",
    notes: "Vaporized secretions produce a short, intense 'white light' non-dual experience."
  },
  {
    vernacularName: "Jurema",
    species: "Mimosa tenuiflora",
    phytochemicals: "DMT",
    effectClass: "Psychedelic",
    regionCulture: "Brazil / Jurema Cult",
    notes: "Root bark used in 'Vinho da Jurema'. Contains oral DMT (MAOI mechanism is debated)."
  },
  {
    vernacularName: "Bitter-grass",
    species: "Calea ternifolia",
    phytochemicals: "Sesquiterpene lactones",
    effectClass: "Oneirogen",
    regionCulture: "Mexico / Chontal",
    notes: "Smoked or drunk as tea to receive messages from gods during sleep."
  },

  // --- ASIA ---
  {
    vernacularName: "Cannabis (Bhang)",
    species: "Cannabis sativa",
    phytochemicals: "THC, CBD",
    effectClass: "Psychoactive",
    regionCulture: "India / Sadhu / Shiva Devotees",
    notes: "Consumed as Bhang Lassi during Holi. Sacred to Lord Shiva."
  },
  {
    vernacularName: "Soma / Haoma",
    species: "Unknown (Ephedra? Peganum?)",
    phytochemicals: "Ephedrine? Harmaline?",
    effectClass: "Stimulant / Entheogen",
    regionCulture: "Ancient India / Persia",
    notes: "The mysterious Vedic sacrament. Likely Ephedra sinica or Peganum harmala."
  },
  {
    vernacularName: "Betel Nut",
    species: "Areca catechu",
    phytochemicals: "Arecoline",
    effectClass: "Stimulant",
    regionCulture: "Southeast Asia / Taiwan",
    notes: "Chewed with lime and betel leaf. Social and ritual bonding agent."
  },
  {
    vernacularName: "Blue Lotus",
    species: "Nymphaea caerulea",
    phytochemicals: "Apomorphine",
    effectClass: "Mild Sedative",
    regionCulture: "Ancient Egypt / Middle East",
    notes: "Steeped in wine. Symbol of rebirth and the sun god Ra."
  },
  {
    vernacularName: "Syrian Rue",
    species: "Peganum harmala",
    phytochemicals: "Harmaline (MAOI)",
    effectClass: "Psychoactive / MAOI",
    regionCulture: "Middle East / Iran",
    notes: "Seeds burned as 'Esphand' to ward off the Evil Eye. Also an Ayahuasca analogue."
  },
  {
    vernacularName: "Datura (Dhatura)",
    species: "Datura metel",
    phytochemicals: "Scopolamine",
    effectClass: "Deliriant",
    regionCulture: "India / Shiva Worship",
    notes: "Offerings of the flower are made to Shiva. Consumption is rare and dangerous."
  },

  // --- EUROPE ---
  {
    vernacularName: "Fly Agaric",
    species: "Amanita muscaria",
    phytochemicals: "Muscimol",
    effectClass: "Deliriant / Sedative",
    regionCulture: "Siberia / Sami / Vikings?",
    notes: "Urine of the shaman who consumed it was drunk by others to recycle active compounds."
  },
  {
    vernacularName: "Henbane",
    species: "Hyoscyamus niger",
    phytochemicals: "Hyoscyamine",
    effectClass: "Deliriant",
    regionCulture: "Ancient Greece / Oracles",
    notes: "Likely ingredient in the fumes inhaled by the Oracle of Delphi."
  },
  {
    vernacularName: "Belladonna",
    species: "Atropa belladonna",
    phytochemicals: "Atropine",
    effectClass: "Deliriant",
    regionCulture: "Medieval Europe / Witches",
    notes: "Ingredient in 'Flying Ointments' absorbed transdermally through broomsticks."
  },
  {
    vernacularName: "Mandrake",
    species: "Mandragora officinarum",
    phytochemicals: "Scopolamine",
    effectClass: "Deliriant / Narcotic",
    regionCulture: "Europe / Folklore",
    notes: "Roots resemble humans. Used in magic rituals and fertility rites."
  },
  {
    vernacularName: "Opium Poppy",
    species: "Papaver somniferum",
    phytochemicals: "Morphine, Codeine",
    effectClass: "Narcotic / Analgesic",
    regionCulture: "Greece (Minoan) / Victorian",
    notes: "Sacred to Demeter and Hypnos. Used in mystery cults for painless sleep/death."
  },
  {
    vernacularName: "Ergot",
    species: "Claviceps purpurea",
    phytochemicals: "Ergotamine (LSD precursor)",
    effectClass: "Psychedelic / Toxic",
    regionCulture: "Greece / Eleusinian Mysteries",
    notes: "Likely key ingredient in the Kykeon potion consumed at Eleusis."
  },

  // --- OCEANIA ---
  {
    vernacularName: "Kava",
    species: "Piper methysticum",
    phytochemicals: "Kavalactones",
    effectClass: "Anxiolytic / Sedative",
    regionCulture: "Polynesia / Fiji / Vanuatu",
    notes: "Root drink shared to settle disputes, welcome guests, and commune with spirits."
  },
  {
    vernacularName: "Pituri",
    species: "Duboisia hopwoodii",
    phytochemicals: "Nicotine, Scopolamine",
    effectClass: "Stimulant",
    regionCulture: "Australia / Aboriginal",
    notes: "Dried leaves chewed for stamina and hunger suppression during Dreamtime walks."
  }
];

export function AuxCord() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<typeof RITUAL_SUBSTANCES[0]>(RITUAL_SUBSTANCES[0]); // Default to first item

  // Filter logic
  const filteredItems = useMemo(() => {
    if (!searchTerm) return RITUAL_SUBSTANCES;
    return RITUAL_SUBSTANCES.filter((item) =>
      item.vernacularName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <GlassCard glowColor="purple" className="flex flex-col h-[700px] relative overflow-hidden transition-all duration-500">
      
      {/* --- HEADER --- */}
      <div className="p-6 border-b border-white/10 bg-black/20 shrink-0 z-20">
        <div className="flex items-center gap-3">
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
              Global Ethnopharmacology Database
            </p>
          </div>
        </div>
      </div>

      {/* --- MASTER-DETAIL LAYOUT --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- LEFT PANEL: THE LIST --- */}
        <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col bg-black/20">
          
          {/* Quick Filter Input (Kept subtle for browsing utility) */}
          <div className="p-4 border-b border-white/5 bg-black/20">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Filter list..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-2 text-sm text-white outline-none focus:border-[hsl(var(--neon-purple))]"
                />
             </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredItems.map((item, index) => {
              const isActive = selectedItem.vernacularName === item.vernacularName;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left px-5 py-4 border-b border-white/5 transition-all flex items-center justify-between group ${
                    isActive 
                      ? "bg-[hsl(var(--neon-purple)/0.1)] border-l-4 border-l-[hsl(var(--neon-purple))]" 
                      : "hover:bg-white/5 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="overflow-hidden">
                    <span className={`block font-bold truncate ${isActive ? "text-white" : "text-gray-300"}`}>
                      {item.vernacularName}
                    </span>
                    <span className="block text-[10px] text-gray-500 font-mono truncate uppercase tracking-wider">
                      {item.species}
                    </span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[hsl(var(--neon-purple))]" />}
                </button>
              );
            })}
            
            {filteredItems.length === 0 && (
               <div className="p-8 text-center text-gray-500 text-sm">
                  <Scroll className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                  No records found.
               </div>
            )}
          </div>
        </div>

        {/* --- RIGHT PANEL: THE DETAILS --- */}
        <div className="hidden md:flex flex-col w-2/3 bg-transparent overflow-y-auto custom-scrollbar p-6 md:p-8">
           <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.vernacularName}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 max-w-2xl mx-auto w-full"
            >
              {/* Title Card */}
              <div className="bg-[hsl(var(--neon-purple)/0.05)] border border-[hsl(var(--neon-purple)/0.2)] p-6 rounded-xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Leaf className="w-40 h-40 text-[hsl(var(--neon-purple))]" />
                </div>
                <div className="relative z-10">
                    <span className="inline-block px-2 py-1 bg-[hsl(var(--neon-purple)/0.2)] border border-[hsl(var(--neon-purple)/0.3)] rounded text-[10px] font-bold text-[hsl(var(--neon-purple))] uppercase tracking-widest mb-2">
                        Ethnobotanical Record
                    </span>
                    <h2 className="text-4xl font-black text-white mb-2">{selectedItem.vernacularName}</h2>
                    <p className="text-[hsl(var(--neon-purple))] font-mono italic text-lg">{selectedItem.species}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 gap-4">
                
                {/* Region */}
                <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-black/40 rounded-lg text-orange-400">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Region & Culture</h3>
                      <p className="text-white font-medium text-lg">{selectedItem.regionCulture}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Phytochemicals */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                      <div className="p-2 bg-black/40 rounded-lg text-[hsl(var(--neon-cyan))] w-fit mb-3">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Compounds</h3>
                      <p className="text-white font-medium leading-tight">{selectedItem.phytochemicals}</p>
                    </div>

                    {/* Effect Class */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                      <div className="p-2 bg-black/40 rounded-lg text-[hsl(var(--neon-green))] w-fit mb-3">
                        <BrainCircuit className="w-6 h-6" />
                      </div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Effect Class</h3>
                      <p className="text-white font-medium leading-tight">{selectedItem.effectClass}</p>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-black/30 border border-white/10 p-6 rounded-xl flex gap-5">
                  <Info className="w-6 h-6 text-[hsl(var(--neon-purple))] shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-bold text-[hsl(var(--neon-purple))] uppercase tracking-wider mb-2">Historical Context</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {selectedItem.notes}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </GlassCard>
  );
}