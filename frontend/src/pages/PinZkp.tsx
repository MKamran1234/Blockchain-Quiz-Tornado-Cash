import { useState } from "react";
import { Fingerprint, Play } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import GlassCard from "../components/GlassCard";
import HashCard from "../components/HashCard";
import { useMixer } from "../state/MixerContext";
import type { PinZkpResult } from "../types";

export default function PinZkp() {
  const { runPinZkp } = useMixer();
  const [pin, setPin] = useState("1234");
  const [result, setResult] = useState<PinZkpResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(await runPinZkp(pin));
    setLoading(false);
  }

  const progress = result ? 100 : loading ? 42 : 0;
  const lastRound = result?.rounds[result.rounds.length - 1];

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <GlassCard className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <Fingerprint className="text-teal-200" />
          <div>
            <h2 className="section-title">4-Digit PIN Zero-Knowledge Simulation</h2>
            <p className="muted text-sm">A simplified challenge-response demo, not a production zkSNARK.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block" htmlFor="pin-input">
            <span className="mb-2 block text-sm text-slate-300">Prover PIN (hidden from report)</span>
            <input id="pin-input" className="input" maxLength={4} pattern="\d{4}" type="password" value={pin} onChange={(event) => setPin(event.target.value)} required />
          </label>
          <AnimatedButton className="w-full" disabled={loading} type="submit">
            <Play size={18} /> {loading ? "Running 100 iterations..." : "Run Protocol"}
          </AnimatedButton>
        </form>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm text-slate-300">
            <span>Iteration progress</span>
            <span>{result ? "100 / 100" : loading ? "running" : "0 / 100"}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-teal-300 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </GlassCard>

      <section className="space-y-5">
        {result ? (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              <GlassCard className="p-5"><p className="text-sm text-slate-400">PIN Revealed</p><p className="mt-2 text-2xl font-bold text-white">{result.hiddenPin}</p></GlassCard>
              <GlassCard className="p-5"><p className="text-sm text-slate-400">Challenge Bit</p><p className="mt-2 text-2xl font-bold text-white">{lastRound?.challengeBit}</p></GlassCard>
              <GlassCard className="p-5"><p className="text-sm text-slate-400">Cheating Probability</p><p className="mt-2 text-2xl font-bold text-teal-100">≈ {result.cheatingProbability}</p></GlassCard>
            </div>
            <HashCard label="Commitment hash" value={result.commitment} />
            <GlassCard className="p-5">
              <h3 className="section-title">Verification Result</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                All 100 rounds verified. The verifier learns only that the prover likely knows the valid 4-digit PIN.
                The verifier does not learn the actual PIN digits. This is a simplified educational ZKP simulation, not
                a production-grade zkSNARK.
              </p>
              <p className="mt-3 font-mono text-xs text-slate-400">Last response hash: {lastRound?.response}</p>
            </GlassCard>
          </>
        ) : (
          <GlassCard className="p-6 text-slate-300">Run the 100-iteration protocol to display the commitment, challenges, and final probability.</GlassCard>
        )}
      </section>
    </div>
  );
}
