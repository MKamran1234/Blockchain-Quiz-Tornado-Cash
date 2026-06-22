import { Network } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MixingPool from "../components/MixingPool";
import HashCard from "../components/HashCard";
import { useMixer } from "../state/MixerContext";

export default function Pool() {
  const { deposits, stats } = useMixer();
  return (
    <div className="space-y-5">
      <GlassCard className="p-5">
        <div className="flex items-center gap-3">
          <Network className="text-teal-200" />
          <div>
            <h2 className="section-title">Visual Mixing Pool</h2>
            <p className="muted text-sm">
              Anonymous commitments float together. Pool records intentionally do not link deposit identity with withdrawal identity.
            </p>
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-teal-300/20 bg-teal-300/10 p-4 text-teal-100">
          Current anonymity set size: <strong>{stats.anonymitySetSize}</strong>. More commitments create more plausible depositors.
        </div>
      </GlassCard>

      <MixingPool deposits={deposits} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {deposits.map((deposit) => (
          <HashCard key={deposit.id} label={`${deposit.withdrawn ? "Spent" : "Active"} commitment`} value={deposit.commitment} />
        ))}
      </div>
    </div>
  );
}
