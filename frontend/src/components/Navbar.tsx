import { GraduationCap, Moon, RotateCcw, ShieldCheck, Sun } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import { useMixer } from "../state/MixerContext";

export default function Navbar({ activePage, darkMode, onToggleTheme }: { activePage: string; darkMode: boolean; onToggleTheme: () => void }) {
  const { resetDemo } = useMixer();
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/72 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-teal-300">
            <GraduationCap size={15} /> Classroom academic demo
          </p>
          <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{activePage}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200 sm:flex">
            <ShieldCheck size={15} /> No real funds connected
          </span>
          <AnimatedButton className="px-3 py-2 text-xs" onClick={() => void resetDemo()} variant="secondary">
            <RotateCcw size={15} /> Reset
          </AnimatedButton>
          <button className="icon-button" onClick={onToggleTheme} title="Toggle theme" type="button">
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>
    </header>
  );
}
