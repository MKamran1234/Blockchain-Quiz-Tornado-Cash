import { LockKeyhole } from "lucide-react";
import { routes } from "../routes";

export default function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate: (path: string) => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-slate-950/78 p-5 backdrop-blur-xl lg:block">
      <button className="mb-8 text-left" onClick={() => onNavigate("/")} type="button">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-300 text-slate-950 shadow-glow">
          <LockKeyhole size={24} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-white">ZK Privacy Classroom</h2>
        <p className="text-sm leading-6 text-slate-400">Commitments, nullifiers, Merkle proofs, and educational ZKP logic.</p>
      </button>
      <nav className="space-y-2">
        {routes.map(({ path, label, icon: Icon }) => (
          <button
            className={`nav-item ${pathname === path ? "nav-item-active" : ""}`}
            key={path}
            onClick={() => onNavigate(path)}
            type="button"
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
