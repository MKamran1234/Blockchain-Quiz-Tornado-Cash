import { Activity, Fingerprint, GitBranch, Network, ShieldCheck, Wallet } from "lucide-react";
import GlassCard from "../components/GlassCard";
import StatCard from "../components/StatCard.tsx";
import TimelineLog from "../components/TimelineLog";
import { shortHash } from "../lib/crypto";
import { useMixer } from "../state/MixerContext";

export default function Dashboard() {
  const { stats, deposits, logs } = useMixer();
  const latestDeposit = deposits[0];
  const rows = [
    { name: "Deposits", value: stats.totalDeposits, color: "bg-teal-300" },
    { name: "Withdrawals", value: stats.totalWithdrawals, color: "bg-sky-300" },
    { name: "Nullifiers", value: stats.usedNullifiers, color: "bg-emerald-300" },
  ];
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard icon={Wallet} label="Total Deposits" value={stats.totalDeposits} />
        <StatCard icon={ShieldCheck} label="Total Withdrawals" value={stats.totalWithdrawals} />
        <StatCard icon={Activity} label="Active Commitments" value={stats.activeCommitments} />
        <StatCard icon={Fingerprint} label="Used Nullifiers" value={stats.usedNullifiers} />
        <StatCard icon={Network} label="Anonymity Set" value={stats.anonymitySetSize} />
        <StatCard icon={GitBranch} label="Merkle Root" value={shortHash(stats.merkleRoot, 8, 6)} />
      </div>

      <GlassCard className="p-5">
        <h2 className="section-title">Formula-Based Transaction Commitment</h2>
        <p className="muted mt-2 text-sm">
          Transaction/commitment default empty message se nahi aati. Demo me commitment formula se banti hai:
        </p>
        <div className="mt-4 rounded-lg border border-teal-300/20 bg-teal-300/10 p-4">
          <p className="font-mono text-lg font-bold text-teal-100">c = SHA-256(s || n)</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Here, <span className="font-mono text-white">s</span> is the random secret and{" "}
            <span className="font-mono text-white">n</span> is the nonce. The pool stores only{" "}
            <span className="font-mono text-white">c</span>, not the original secret.
          </p>
          <p className="mt-3 break-all font-mono text-xs text-slate-400">
            Latest c: {shortHash(latestDeposit?.commitment, 22, 14)}
          </p>
        </div>
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="p-5">
          <h2 className="section-title">Blockchain Analytics Demo</h2>
          <p className="muted mt-2 text-sm">Session activity generated from the in-memory educational pool.</p>
          <div className="mt-6 space-y-5">
            {rows.map((row) => (
              <div key={row.name}>
                <div className="mb-2 flex justify-between text-sm text-slate-300">
                  <span>{row.name}</span>
                  <span>{row.value}</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${row.color}`} style={{ width: `${(row.value / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            Security status: commitments are public, secrets are hidden, and each successful withdrawal consumes a nullifier.
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="section-title">Latest Verification Logs</h2>
          <div className="mt-4">
            <TimelineLog logs={logs.slice(0, 6)} />
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <h2 className="section-title">Security Status Cards</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["Commitment privacy", "Secrets are never displayed in pool records."],
            ["Nullifier protection", `${stats.usedNullifiers} nullifier(s) stored after withdrawals.`],
            ["Pool health", `${deposits.length} commitments provide the current anonymity set.`],
          ].map(([title, body]) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={title}>
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
