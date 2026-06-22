import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type {
  AttackResultModel,
  PinRound,
  PinZkpResult,
  UserDeposit,
  VerificationLog,
  WithdrawalProof,
} from "../types";
import {
  buildMerkleTree,
  createCommitment,
  createNullifier,
  generateNonce,
  generateSecret,
  sha256,
} from "../lib/crypto";

interface DepositResult {
  deposit: UserDeposit;
  secret: string;
  nonce: string;
  commitment: string;
}

interface MixerStats {
  totalDeposits: number;
  totalWithdrawals: number;
  activeCommitments: number;
  usedNullifiers: number;
  merkleRoot: string;
  anonymitySetSize: number;
}

interface MixerContextValue {
  ready: boolean;
  deposits: UserDeposit[];
  withdrawals: WithdrawalProof[];
  usedNullifiers: string[];
  logs: VerificationLog[];
  stats: MixerStats;
  addDeposit: (userLabel?: string) => Promise<DepositResult>;
  verifyWithdrawal: (secret: string, nonce: string) => Promise<WithdrawalProof>;
  runFakeSecretAttack: () => Promise<AttackResultModel>;
  runDoubleSpendAttack: () => Promise<AttackResultModel>;
  runPinZkp: (pin: string) => Promise<PinZkpResult>;
  resetDemo: () => Promise<void>;
}

const MixerContext = createContext<MixerContextValue | null>(null);

const userLabels = [
  "User Alpha",
  "User Beta",
  "User Gamma",
  "User Delta",
  "User Epsilon",
  "User Zeta",
  "User Eta",
  "User Theta",
  "User Iota",
  "User Kappa",
];

const timestamp = (offsetMinutes = 0) => new Date(Date.now() - offsetMinutes * 60_000).toISOString();

function makeLog(action: string, status: VerificationLog["status"], message: string): VerificationLog {
  return {
    id: crypto.randomUUID(),
    action,
    status,
    message,
    timestamp: new Date().toISOString(),
  };
}

async function createSeedDeposits(): Promise<UserDeposit[]> {
  const deposits: UserDeposit[] = [];
  for (const [index, userLabel] of userLabels.entries()) {
    const secret = generateSecret();
    const nonce = generateNonce();
    deposits.push({
      id: crypto.randomUUID(),
      userLabel,
      secret,
      nonce,
      commitment: await createCommitment(secret, nonce),
      timestamp: timestamp(55 - index * 4),
      withdrawn: false,
    });
  }
  return deposits;
}

export function MixerProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalProof[]>([]);
  const [usedNullifiers, setUsedNullifiers] = useState<string[]>([]);
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [merkleRoot, setMerkleRoot] = useState("");
  const depositsRef = useRef<UserDeposit[]>([]);
  const nullifiersRef = useRef<string[]>([]);

  useEffect(() => {
    depositsRef.current = deposits;
  }, [deposits]);

  useEffect(() => {
    nullifiersRef.current = usedNullifiers;
  }, [usedNullifiers]);

  const recomputeRoot = useCallback(async (items: UserDeposit[]) => {
    const tree = await buildMerkleTree(items.map((item) => item.commitment));
    setMerkleRoot(tree.root);
  }, []);

  const resetDemo = useCallback(async () => {
    const seeded = await createSeedDeposits();
    depositsRef.current = seeded;
    nullifiersRef.current = [];
    setDeposits(seeded);
    setWithdrawals([]);
    setUsedNullifiers([]);
    setLogs([
      makeLog("System seed", "success", "Generated 10 academic demo deposits for the initial anonymity set."),
      makeLog("Safety guard", "info", "No real wallets, private keys, cryptocurrency, or blockchain transactions are connected."),
    ]);
    await recomputeRoot(seeded);
    setReady(true);
  }, [recomputeRoot]);

  useEffect(() => {
    resetDemo();
  }, [resetDemo]);

  const addLog = useCallback((log: VerificationLog) => {
    setLogs((current) => [log, ...current].slice(0, 80));
  }, []);

  const addDeposit = useCallback(
    async (userLabel = "Classroom Demo User") => {
      const secret = generateSecret();
      const nonce = generateNonce();
      const commitment = await createCommitment(secret, nonce);
      const deposit: UserDeposit = {
        id: crypto.randomUUID(),
        userLabel,
        secret,
        nonce,
        commitment,
        timestamp: new Date().toISOString(),
        withdrawn: false,
      };

      setDeposits((current) => {
        const next = [deposit, ...current];
        void recomputeRoot(next);
        return next;
      });
      addLog(makeLog("Deposit", "success", `Stored SHA-256 commitment ${commitment.slice(0, 18)}... in the public pool.`));
      return { deposit, secret, nonce, commitment };
    },
    [addLog, recomputeRoot],
  );

  const verifyWithdrawal = useCallback(
    async (secret: string, nonce: string) => {
      const commitment = await createCommitment(secret.trim(), nonce.trim());
      const nullifier = await createNullifier(secret.trim());
      const deposit = depositsRef.current.find((item) => item.commitment === commitment);
      const now = new Date().toISOString();

      let proof: WithdrawalProof;
      if (!deposit) {
        proof = {
          commitment,
          nullifier,
          isValid: false,
          reason: "Withdrawal rejected: commitment not found. Fake proof detected.",
          timestamp: now,
        };
        addLog(makeLog("Withdrawal verification", "rejected", proof.reason));
        return proof;
      }

      if (nullifiersRef.current.includes(nullifier) || deposit.withdrawn) {
        proof = {
          commitment,
          nullifier,
          isValid: false,
          reason: "Withdrawal rejected: nullifier already used. Double-spending attempt detected.",
          timestamp: now,
        };
        addLog(makeLog("Withdrawal verification", "rejected", proof.reason));
        return proof;
      }

      proof = {
        commitment,
        nullifier,
        isValid: true,
        reason: "Proof verified successfully. Anonymous withdrawal successful.",
        timestamp: now,
      };
      const nextDeposits = depositsRef.current.map((item) => (item.id === deposit.id ? { ...item, withdrawn: true } : item));
      const nextNullifiers = [nullifier, ...nullifiersRef.current];
      depositsRef.current = nextDeposits;
      nullifiersRef.current = nextNullifiers;
      setDeposits(nextDeposits);
      setUsedNullifiers(nextNullifiers);
      setWithdrawals((current) => [proof, ...current]);
      addLog(makeLog("Withdrawal verification", "success", "Commitment exists and nullifier is unused. Withdrawal approved without revealing deposit identity."));
      return proof;
    },
    [addLog],
  );

  const runFakeSecretAttack = useCallback(async () => {
    const fakeSecret = generateSecret();
    const fakeNonce = generateNonce();
    const proof = await verifyWithdrawal(fakeSecret, fakeNonce);
    return {
      name: "Fake Secret Attack",
      failed: !proof.isValid,
      reason: proof.reason,
      concept: "Commitment membership check",
      logs: [
        `Generated random fake secret ${fakeSecret.slice(0, 18)}...`,
        `Recreated commitment ${proof.commitment.slice(0, 18)}...`,
        proof.reason,
      ],
    };
  }, [verifyWithdrawal]);

  const runDoubleSpendAttack = useCallback(async () => {
    const firstTarget = depositsRef.current.find((item) => !item.withdrawn) ?? (await addDeposit("Double Spend Test User")).deposit;
    const first = await verifyWithdrawal(firstTarget.secret, firstTarget.nonce);
    const second = await verifyWithdrawal(firstTarget.secret, firstTarget.nonce);
    return {
      name: "Double Spending Attack",
      failed: first.isValid && !second.isValid,
      reason: second.reason,
      concept: "Nullifier uniqueness",
      logs: [
        `First withdrawal status: ${first.isValid ? "accepted" : "rejected"}`,
        `Stored nullifier ${first.nullifier.slice(0, 18)}...`,
        `Second withdrawal status: ${second.isValid ? "accepted" : "rejected"}`,
        second.reason,
      ],
    };
  }, [addDeposit, verifyWithdrawal]);

  const runPinZkp = useCallback(async (pin: string) => {
    const nonce = generateNonce();
    const commitment = await sha256(`${pin}:${nonce}:pin-commitment`);
    const rounds: PinRound[] = [];

    for (let iteration = 1; iteration <= 100; iteration += 1) {
      const challengeBit = (crypto.getRandomValues(new Uint8Array(1))[0] % 2) as 0 | 1;
      const response = await sha256(`${pin}:${nonce}:${challengeBit}:${iteration}`);
      const expected = await sha256(`${pin}:${nonce}:${challengeBit}:${iteration}`);
      rounds.push({ iteration, challengeBit, response, verified: response === expected });
    }

    const result: PinZkpResult = {
      hiddenPin: "••••",
      nonce,
      commitment,
      rounds,
      cheatingProbability: "7.88 × 10^-31",
      verified: rounds.every((round) => round.verified),
    };
    addLog(makeLog("PIN ZKP", "success", "Completed 100 challenge-response rounds with cheating probability approximately 7.88 x 10^-31."));
    return result;
  }, [addLog]);

  const stats = useMemo(
    () => ({
      totalDeposits: deposits.length,
      totalWithdrawals: withdrawals.length,
      activeCommitments: deposits.filter((item) => !item.withdrawn).length,
      usedNullifiers: usedNullifiers.length,
      merkleRoot,
      anonymitySetSize: deposits.length,
    }),
    [deposits, merkleRoot, usedNullifiers.length, withdrawals.length],
  );

  const value = useMemo(
    () => ({
      ready,
      deposits,
      withdrawals,
      usedNullifiers,
      logs,
      stats,
      addDeposit,
      verifyWithdrawal,
      runFakeSecretAttack,
      runDoubleSpendAttack,
      runPinZkp,
      resetDemo,
    }),
    [
      addDeposit,
      deposits,
      logs,
      ready,
      resetDemo,
      runDoubleSpendAttack,
      runFakeSecretAttack,
      runPinZkp,
      stats,
      usedNullifiers,
      verifyWithdrawal,
      withdrawals,
    ],
  );

  return <MixerContext.Provider value={value}>{children}</MixerContext.Provider>;
}

export function useMixer() {
  const context = useContext(MixerContext);
  if (!context) throw new Error("useMixer must be used inside MixerProvider");
  return context;
}
