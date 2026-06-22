import ExplanationCard from "../components/ExplanationCard";
import GlassCard from "../components/GlassCard";

const sections = [
  ["Deposit Phase", "A simulated user generates a secret and nonce. The app computes a SHA-256 commitment and stores only that commitment in the public pool."],
  ["Commitment Phase", "A commitment lets the user bind to hidden data without revealing it. Later, the same secret and nonce recreate the same hash."],
  ["Proof Phase", "The simplified proof says: I know the secret and nonce opening one commitment in the pool."],
  ["Verification Phase", "The verifier recomputes the commitment, checks membership, and rejects reused nullifiers."],
  ["Privacy Layer", "Deposits and withdrawals are not directly linked in the UI. Only commitments and nullifiers become public demo records."],
  ["Nullifier", "The nullifier is a deterministic hash from the secret. It is safe to reveal for double-spend prevention but does not reveal the original secret in this demo."],
  ["Double-Spending Prevention", "If the same secret is used again, the same nullifier appears, and the withdrawal is rejected."],
  ["Merkle Tree", "Leaves represent hashed deposits. Pair hashes are repeatedly combined until one Merkle root summarizes the set."],
  ["Anonymity Set", "With 10 deposits, a valid proof could correspond to any one of 10 depositors if no metadata leaks."],
  ["Cheating Probability", "In the PIN protocol, each random challenge gives a dishonest prover a 1/2 chance. Repeating 100 rounds gives (1/2)^100."],
  ["Simplified ZKP vs zkSNARK", "This project uses transparent educational hashes and checks. Real zkSNARKs compile statements into circuits and produce succinct cryptographic proofs."],
  ["High-Level Tornado Cash Comparison", "Real Tornado Cash used smart contracts, fixed-denomination pools, Merkle roots, nullifiers, and zkSNARK verification. This app keeps only the learning concepts and removes real money functionality."],
];

export default function About() {
  return (
    <div className="space-y-5">
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-white">Academic Explanation and Limitations</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          This project is designed for university learning. It intentionally avoids real wallets, real cryptocurrency,
          real blockchain deployments, production privacy protocol code, AI image detection, YOLO, machine learning,
          computer vision, datasets, or object detection.
        </p>
      </GlassCard>
      <section className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <ExplanationCard key={title} title={title}>
            <p>{body}</p>
          </ExplanationCard>
        ))}
      </section>
    </div>
  );
}
