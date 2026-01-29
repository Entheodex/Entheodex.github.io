import { BioClock } from "../components/BioClock";
import { Oracle } from "../components/Oracle";
import { AuxCord } from "../components/AuxCord";
import { Kaleidoscope } from "../components/Kaleidoscope";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-24 animate-in fade-in duration-700 w-full">
      
      {/* 1. TOP LEFT: The Tracker */}
      <div className="h-auto max-h-[1000px] w-full">
        <BioClock />
      </div>

      {/* 2. TOP RIGHT: The Oracle */}
      <div className="h-auto max-h-[1000px] w-full">
        <Oracle />
      </div>

      {/* 3. BOTTOM LEFT: The Visuals (Fluid Void) */}
      <div className="h-auto max-h-[2000px] w-full">
        <Kaleidoscope />
      </div>

      {/* 4. BOTTOM RIGHT: The Music */}
      <div className="h-auto max-h-[2000px] w-full">
        <AuxCord />
      </div>

    </div>
  );
}