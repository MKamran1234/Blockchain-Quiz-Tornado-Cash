import { Printer } from "lucide-react";
import AnimatedButton from "../components/AnimatedButton";
import HashCard from "../components/HashCard";
import ReportSection from "../components/ReportSection";
import TimelineLog from "../components/TimelineLog";
import { shortHash } from "../lib/crypto";
import { useMixer } from "../state/MixerContext";

export default function Report() {
  const { deposits, withdrawals, logs, stats, usedNullifiers } = useMixer();
  const latestDeposit = deposits[0];
  const latestWithdrawal = withdrawals[0];

  return (
    <div className="space-y-5 print:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white">Assignment Report Output</h2>
          <p className="mt-2 text-sm text-slate-400">Screenshot-friendly proof page for the classroom demo.</p>
        </div>
        <AnimatedButton onClick={() => window.print()}>
          <Printer size={17} /> Export PDF / Print Page
        </AnimatedButton>
      </div>

      <ReportSection title="Educational Safety Statement">
        This is a classroom/academic simulation only. It does not connect to cryptocurrency, wallets, private keys,
        smart contracts, real blockchain networks, or production anonymous finance systems.
      </ReportSection>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReportSection title="Deposit Output Logs">
          <p>Total deposits: {stats.totalDeposits}</p>
          <p>Latest commitment: {shortHash(latestDeposit?.commitment, 18, 12)}</p>
          <p>Formula: c = SHA-256(s || n)</p>
          <p>Deposit flow: secret + nonce to SHA-256 commitment to stored in mixing pool.</p>
        </ReportSection>
        <ReportSection title="Withdrawal Output Logs">
          <p>Total withdrawals: {stats.totalWithdrawals}</p>
          <p>Used nullifiers: {usedNullifiers.length}</p>
          <p>
            Latest result:{" "}
            {latestWithdrawal?.reason ??
              "Withdrawal transaction appears only after a valid proof. Deposit commitment is still shown by c = SHA-256(s || n)."}
          </p>
        </ReportSection>
      </div>

      <ReportSection title="Core Cryptographic Outputs">
        <div className="grid gap-3 md:grid-cols-2">
          <HashCard label="Merkle tree root" value={stats.merkleRoot} reveal />
          <HashCard label="Latest nullifier" value={usedNullifiers[0]} />
        </div>
      </ReportSection>

      <ReportSection title="PIN ZKP 100-Iteration Result">
        The 4-digit PIN protocol runs 100 challenge-response iterations. A dishonest prover has probability
        (1/2)^100, displayed as cheating probability ≈ 7.88 × 10^-31. The verifier learns only that the prover likely
        knows the valid PIN, not the actual PIN digits.
      </ReportSection>

      <ReportSection title="Merkle Proof Verification for 3 Leaves">
        Open the Merkle Tree page and click “Verify 3 Leaves” to show proof success for coin_user_1, coin_user_5, and
        coin_user_9. Each proof displays sibling hashes, left/right direction, reconstructed root, and comparison with
        the actual root.
      </ReportSection>

      <ReportSection title="Anonymity Set Explanation">
        If an outsider sees only the root and a valid proof, they cannot directly determine which leaf was spent without
        the leaf index or metadata. With 10 deposits, the anonymity set size is 10, so the withdrawal could belong to any
        one of the 10 depositors assuming timing, wallet, IP, and other metadata are not leaked.
      </ReportSection>

      <ReportSection title="Verification Logs">
        <TimelineLog logs={logs.slice(0, 10)} />
      </ReportSection>
    </div>
  );
}
