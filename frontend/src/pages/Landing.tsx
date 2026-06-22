import { motion } from "framer-motion";
import { ArrowRight, Binary, Fingerprint, GitBranch, KeyRound, Network, ShieldCheck } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import ExplanationCard from "../components/ExplanationCard";
import GlassCard from "../components/GlassCard";

const concepts = [
  ["Zero-Knowledge Proof", "A prover convinces a verifier that a statement is true without revealing the private witness."],
  ["Commitment", "SHA-256(secret + nonce) is stored publicly while the secret remains private."],
  ["Nullifier", "A deterministic hash of the secret that prevents the same deposit from being withdrawn twice."],
  ["Merkle Tree", "A compact root commits to all pool deposits while short proofs show membership."],
  ["Anonymity Set", "The number of plausible depositors. This demo starts with 10 classroom users."],
  ["Simplified Flow", "Deposit a commitment, wait inside the pool, then withdraw by proving membership and an unused nullifier."],
];

export default function Landing({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="space-y-14">
      <section className="relative grid min-h-[76vh] items-center gap-8 overflow-hidden py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-teal-200">
            Academic simulation only
          </div>
          <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Privacy-Preserving Transactions using Zero-Knowledge Proofs and Merkle Trees
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            A classroom Tornado Cash-inspired demo for learning hash commitments, nonces, nullifiers, mixing pools,
            Merkle roots, proof verification, and double-spend prevention. No cryptocurrency, wallets, real private
            keys, or blockchain transactions are used.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AnimatedButton onClick={() => navigate("/dashboard")}>
              Open Dashboard <ArrowRight size={18} />
            </AnimatedButton>
            <AnimatedButton onClick={() => navigate("/report")} variant="secondary">
              View Report
            </AnimatedButton>
          </div>
        </motion.div>

        <GlassCard className="relative p-5">
          <div className="hero-chain">
            {[Binary, Fingerprint, GitBranch, Network, KeyRound, ShieldCheck].map((Icon, index) => (
              <motion.div
                className="hero-chain-node"
                key={index}
                animate={{ y: [0, index % 2 ? 16 : -14, 0], rotateY: [0, 16, 0] }}
                transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={28} />
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {concepts.map(([title, body]) => (
          <ExplanationCard key={title} title={title}>
            <p>{body}</p>
          </ExplanationCard>
        ))}
      </section>

      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-white">Deposit / Withdraw Learning Pipeline</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {["Secret + nonce", "SHA-256 commitment", "Merkle membership proof", "Unused nullifier"].map((step, index) => (
            <div className="flow-step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
