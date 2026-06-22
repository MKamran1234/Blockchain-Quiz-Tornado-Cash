import { Copy, Fingerprint } from "lucide-react";
import { shortHash } from "../lib/crypto";

interface HashCardProps {
  label: string;
  value?: string;
  reveal?: boolean;
}

export default function HashCard({ label, value, reveal = false }: HashCardProps) {
  async function copy() {
    if (value) await navigator.clipboard.writeText(value);
  }

  return (
    <div className="hash-card group">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
          <Fingerprint size={14} />
          {label}
        </div>
        {value && (
          <button className="icon-button h-8 min-h-8 w-8 min-w-8" onClick={copy} title={`Copy ${label}`} type="button">
            <Copy size={14} />
          </button>
        )}
      </div>
      <p className="mt-3 break-all font-mono text-sm text-teal-100">{reveal ? value : shortHash(value, 18, 12)}</p>
    </div>
  );
}
