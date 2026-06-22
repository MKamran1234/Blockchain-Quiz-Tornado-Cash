import { ShieldCheck, ShieldX } from "lucide-react";
import type { AttackResultModel } from "../types";
import GlassCard from "./GlassCard";

export default function AttackResult({ result }: { result: AttackResultModel }) {
  const Icon = result.failed ? ShieldCheck : ShieldX;
  return (
    <GlassCard className={`p-5 ${result.failed ? "border-emerald-300/30" : "border-rose-300/30"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{result.failed ? "Attack Failed" : "Attack Succeeded"}</p>
          <h3 className="mt-2 text-lg font-bold text-white">{result.name}</h3>
        </div>
        <Icon className={result.failed ? "text-emerald-200" : "text-rose-200"} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{result.reason}</p>
      <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-teal-100">
        Security concept used: {result.concept}
      </div>
      <div className="mt-4 space-y-2">
        {result.logs.map((log) => (
          <p className="font-mono text-xs text-slate-400" key={log}>{log}</p>
        ))}
      </div>
    </GlassCard>
  );
}
