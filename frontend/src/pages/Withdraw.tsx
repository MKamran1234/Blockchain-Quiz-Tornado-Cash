import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import GlassCard from "../components/GlassCard";
import ProofResultCard from "../components/ProofResultCard";
import { useMixer } from "../state/MixerContext";
import type { WithdrawalProof } from "../types";

export default function Withdraw() {
  const { verifyWithdrawal } = useMixer();
  const [secret, setSecret] = useState("");
  const [nonce, setNonce] = useState("");
  const [proof, setProof] = useState<WithdrawalProof | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setProof(null);
    await new Promise((resolve) => setTimeout(resolve, 550));
    setProof(await verifyWithdrawal(secret, nonce));
    setLoading(false);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <GlassCard className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <LockKeyhole className="text-teal-200" />
          <div>
            <h2 className="section-title">Withdrawal / Proof Module</h2>
            <p className="muted text-sm">Recreate commitment, verify pool membership, and check the nullifier.</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <label className="block" htmlFor="withdraw-secret">
            <span className="mb-2 block text-sm text-slate-300">Secret</span>
            <input id="withdraw-secret" className="input font-mono text-sm" value={secret} onChange={(event) => setSecret(event.target.value)} required />
          </label>
          <label className="block" htmlFor="withdraw-nonce">
            <span className="mb-2 block text-sm text-slate-300">Nonce</span>
            <input id="withdraw-nonce" className="input font-mono text-sm" value={nonce} onChange={(event) => setNonce(event.target.value)} required />
          </label>
          <AnimatedButton className="w-full" disabled={loading} type="submit">
            <ShieldCheck size={18} /> {loading ? "Verifying proof..." : "Verify and Withdraw"}
          </AnimatedButton>
        </form>
      </GlassCard>

      <section className="space-y-4">
        {loading && <GlassCard className="p-6 text-teal-100">Checking commitment membership and nullifier uniqueness...</GlassCard>}
        {proof ? (
          <ProofResultCard proof={proof} />
        ) : (
          <GlassCard className="p-6 text-slate-300">Verification result will appear here. The original deposit identity is not revealed.</GlassCard>
        )}
        <GlassCard className="p-5">
          <h3 className="section-title">Verification Rules</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            <p>1. Commitment must exist in the mixing pool.</p>
            <p>2. Nullifier must not have been used before.</p>
            <p>3. If both are true, the educational proof is valid.</p>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
