import { useState } from "react";
import { Copy, Eye, EyeOff, Sparkles, Wallet } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import GlassCard from "../components/GlassCard";
import HashCard from "../components/HashCard";
import { useMixer } from "../state/MixerContext";

export default function Deposit() {
  const { addDeposit } = useMixer();
  const [userLabel, setUserLabel] = useState("Student Demo User");
  const [result, setResult] = useState<Awaited<ReturnType<typeof addDeposit>> | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setResult(await addDeposit(userLabel));
    setLoading(false);
  }

  async function copyNote() {
    if (!result) return;
    await navigator.clipboard.writeText(JSON.stringify({ secret: result.secret, nonce: result.nonce, commitment: result.commitment }, null, 2));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <Wallet className="text-teal-200" />
          <div>
            <h2 className="section-title">Deposit Simulation Module</h2>
            <p className="muted text-sm">User secret + nonce to SHA-256 commitment to commitment stored in the pool.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block" htmlFor="deposit-user-label">
            <span className="mb-2 block text-sm text-slate-300">Simulated user label</span>
            <input id="deposit-user-label" className="input" value={userLabel} onChange={(event) => setUserLabel(event.target.value)} required />
          </label>
          <AnimatedButton className="w-full" disabled={loading} type="submit">
            <Sparkles size={18} /> {loading ? "Generating commitment..." : "Generate Secret, Nonce, and Deposit"}
          </AnimatedButton>
        </form>
        <div className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Save the secret and nonce for demo withdrawal. Without them, the system cannot recreate the commitment.
        </div>
      </GlassCard>

      <div className="space-y-5">
        {result ? (
          <GlassCard className="p-5">
            <p className="text-lg font-bold text-emerald-200">Deposit success: commitment added to the mixing pool.</p>
            <div className="mt-4 rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
              <p className="font-mono text-lg font-bold text-teal-100">c = SHA-256(s || n)</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This transaction commitment is generated from the random secret and nonce, then stored as the public
                pool entry.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <HashCard label="Commitment hash" value={result.commitment} />
              <HashCard label="Nonce" value={result.nonce} reveal />
              <div className="hash-card sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Secret</p>
                  <button className="icon-button h-8 min-h-8 w-8 min-w-8" onClick={() => setShowSecret((value) => !value)} type="button">
                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="mt-3 break-all font-mono text-sm text-teal-100">{showSecret ? result.secret : "Hidden by default for privacy"}</p>
              </div>
            </div>
            <AnimatedButton className="mt-4" onClick={copyNote} variant="secondary">
              <Copy size={17} /> Copy Secret for Demo Withdrawal
            </AnimatedButton>
          </GlassCard>
        ) : (
          <GlassCard className="p-6 text-slate-300">Generated cryptographic-style data will appear here.</GlassCard>
        )}
      </div>
    </div>
  );
}
