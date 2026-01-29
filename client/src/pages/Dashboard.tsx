import { BioClock } from "@/components/BioClock";
import { Oracle } from "@/components/Oracle";
import { Kaleidoscope } from "@/components/Kaleidoscope";
import { AuxCord } from "@/components/AuxCord";
import { MeltText } from "@/components/ui/MeltText";

export default function Dashboard() {
  return (
    <div className="min-h-screen relative text-foreground selection:bg-[hsl(var(--neon-purple))] selection:text-white">
      

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <header className="mb-12 text-center space-y-2">
          <MeltText 
            text="PSYCHONAUT DASHBOARD" 
            as="h1" 
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--neon-purple))] via-[hsl(var(--neon-cyan))] to-[hsl(var(--neon-pink))] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
          />
          <p className="text-muted-foreground font-mono tracking-widest text-xs md:text-sm">
            SYSTEM STATUS: <span className="text-[hsl(var(--neon-green))] animate-pulse">ONLINE</span> // REALITY: <span className="text-[hsl(var(--neon-pink))]">FLUID</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          
          {/* Top Row: Clock & Oracle */}
          <div className="lg:col-span-1 h-80">
            <BioClock />
          </div>
          <div className="lg:col-span-2 h-80">
            <Oracle />
          </div>

          {/* Middle: Visualizer takes full width on mobile, large on desktop */}
          <div className="lg:col-span-2 min-h-[400px]">
            <Kaleidoscope />
          </div>

          {/* Right/Bottom: Music */}
          <div className="lg:col-span-1 min-h-[400px]">
            <AuxCord />
          </div>

        </div>

        <footer className="mt-16 text-center text-white/20 text-xs font-mono">
          <p>REMEMBER TO DRINK WATER • YOU ARE LOVED</p>
        </footer>
      </main>
    </div>
  );
}
