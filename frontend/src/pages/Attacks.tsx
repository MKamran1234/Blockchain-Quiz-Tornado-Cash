import { useState } from "react";
import { ShieldAlert, WandSparkles } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import AttackResult from "../components/AttackResult";
import GlassCard from "../components/GlassCard";
import { useMixer } from "../state/MixerContext";
import type { AttackResultModel } from "../types";

export default function Attacks() {
  const { runFakeSecretAttack, runDoubleSpendAttack } = useMixer();
  const [results, setResults] = useState<AttackResultModel[]>([]);
  const [loading, setLoading] = useState("");

  async function run(name: string, fn: () => Promise<AttackResultModel>) {
    setLoading(name);
    const result = await fn();
    setResults((current) => [result, ...current.filter((item) => item.name !== result.name)]);
    setLoading("");
  }

  return (
    <div className="space-y-5">
      <GlassCard className="p-5">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-rose-200" />
          <div>
            <h2 className="section-title">Attack Simulation</h2>
            <p className="muted text-sm">Both attacks should fail because the commitment and nullifier rules block them.</p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="font-bold text-white">Attack 1: Fake Secret Attack</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Generate a random fake secret and try to withdraw without a valid deposit.</p>
          <AnimatedButton className="mt-5 w-full" disabled={loading === "fake"} onClick={() => void run("fake", runFakeSecretAttack)}>
            <WandSparkles size={17} /> {loading === "fake" ? "Running..." : "Run Fake Secret Attack"}
          </AnimatedButton>
        </GlassCard>
        <GlassCard className="p-5">
          <h3 className="font-bold text-white">Attack 2: Double Spending Attack</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Use a valid secret twice. The first withdrawal succeeds; the second fails.</p>
          <AnimatedButton className="mt-5 w-full" disabled={loading === "double"} onClick={() => void run("double", runDoubleSpendAttack)}>
            <ShieldAlert size={17} /> {loading === "double" ? "Running..." : "Run Double Spend Attack"}
          </AnimatedButton>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {results.map((result) => <AttackResult key={result.name} result={result} />)}
      </div>
    </div>
  );
}
