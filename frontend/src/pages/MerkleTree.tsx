import { useEffect, useState } from "react";
import { CheckCircle2, GitBranch } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import GlassCard from "../components/GlassCard";
import HashCard from "../components/HashCard";
import MerkleTreeVisualizer from "../components/MerkleTreeVisualizer";
import type { MerkleBuild, MerkleVerification } from "../types";
import { buildMerkleTree, shortHash, verifyLeaf } from "../lib/crypto";

const coinLeaves = Array.from({ length: 10 }, (_, index) => `coin_user_${index + 1}`);

export default function MerkleTree() {
  const [tree, setTree] = useState<MerkleBuild | null>(null);
  const [checks, setChecks] = useState<MerkleVerification[]>([]);

  useEffect(() => {
    void buildMerkleTree(coinLeaves).then(setTree);
  }, []);

  async function verifyThree() {
    setChecks(await Promise.all([0, 4, 8].map((index) => verifyLeaf(coinLeaves, index))));
  }

  return (
    <div className="space-y-5">
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GitBranch className="text-teal-200" />
            <div>
              <h2 className="section-title">Merkle Tree & Anonymity Set</h2>
              <p className="muted text-sm">10 users deposit unique educational coins, each hashed as a Merkle leaf.</p>
            </div>
          </div>
          <AnimatedButton onClick={verifyThree}>
            <CheckCircle2 size={17} /> Verify 3 Leaves
          </AnimatedButton>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <HashCard label="Merkle root" value={tree?.root} reveal />
          <GlassCard className="p-4">
            <p className="text-sm text-slate-400">Anonymity set size</p>
            <p className="mt-2 text-3xl font-bold text-white">10</p>
          </GlassCard>
        </div>
      </GlassCard>

      {tree && (
        <GlassCard className="p-5">
          <h3 className="section-title">Animated Tree Levels</h3>
          <div className="mt-5"><MerkleTreeVisualizer levels={tree.levels} /></div>
        </GlassCard>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {checks.map((check) => (
          <GlassCard className="p-5" key={check.leafIndex}>
            <p className="font-bold text-emerald-200">Leaf {check.leafIndex + 1}: verification success</p>
            <p className="mt-2 font-mono text-sm text-slate-300">{check.leaf}</p>
            <div className="mt-4 space-y-2">
              {check.proof.map((item, index) => (
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3" key={`${item.siblingHash}-${index}`}>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Sibling {index + 1} · {item.direction}</p>
                  <p className="mt-2 break-all font-mono text-xs text-teal-100">{shortHash(item.siblingHash, 14, 10)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 break-all font-mono text-xs text-slate-400">Reconstructed root: {shortHash(check.reconstructedRoot, 16, 12)}</p>
            <p className="mt-2 text-sm text-emerald-100">Matches actual root: {String(check.verified)}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="border-amber-300/30 p-6">
        <h3 className="section-title">Critical Written Answer</h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          No, if only the Merkle root and a valid membership proof are visible without revealing the leaf index or
          additional metadata, the outsider cannot directly determine which exact leaf was spent. The proof only shows
          that one valid deposit exists in the tree. Since there are 10 deposits, the anonymity set size is 10. This
          means the withdrawal could belong to any one of the 10 depositors, assuming no timing, wallet, IP, or other
          metadata is leaked.
        </p>
      </GlassCard>
    </div>
  );
}
