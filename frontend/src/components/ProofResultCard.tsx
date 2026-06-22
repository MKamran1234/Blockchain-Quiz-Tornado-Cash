import { CheckCircle2, XCircle } from "lucide-react";
import GlassCard from "./GlassCard";
import type { WithdrawalProof } from "../types";
import { shortHash } from "../lib/crypto";

export default function ProofResultCard({ proof }: { proof: WithdrawalProof }) {
  const Icon = proof.isValid ? CheckCircle2 : XCircle;
  return (
    <GlassCard className={`p-5 ${proof.isValid ? "border-emerald-300/30" : "border-rose-300/30"}`}>
      <div className="flex items-start gap-3">
        <div className={`rounded-lg border p-3 ${proof.isValid ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200" : "border-rose-300/30 bg-rose-300/10 text-rose-200"}`}>
          <Icon size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-white">{proof.isValid ? "Proof verified successfully" : "Proof rejected"}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{proof.reason}</p>
          <p className="mt-3 break-all font-mono text-xs text-slate-400">Nullifier: {shortHash(proof.nullifier, 18, 12)}</p>
        </div>
      </div>
    </GlassCard>
  );
}
