export interface UserDeposit {
  id: string;
  userLabel: string;
  secret: string;
  nonce: string;
  commitment: string;
  timestamp: string;
  withdrawn: boolean;
}

export interface WithdrawalProof {
  commitment: string;
  nullifier: string;
  isValid: boolean;
  reason: string;
  timestamp: string;
}

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  level: number;
  index: number;
}

export interface MerkleProofItem {
  siblingHash: string;
  direction: "left" | "right";
}

export interface VerificationLog {
  id: string;
  action: string;
  status: "success" | "rejected" | "warning" | "info";
  message: string;
  timestamp: string;
}

export interface MerkleBuild {
  root: string;
  levels: string[][];
  leaves: string[];
}

export interface MerkleVerification {
  leaf: string;
  leafIndex: number;
  proof: MerkleProofItem[];
  reconstructedRoot: string;
  actualRoot: string;
  verified: boolean;
}

export interface PinRound {
  iteration: number;
  challengeBit: 0 | 1;
  response: string;
  verified: boolean;
}

export interface PinZkpResult {
  hiddenPin: string;
  nonce: string;
  commitment: string;
  rounds: PinRound[];
  cheatingProbability: string;
  verified: boolean;
}

export interface AttackResultModel {
  name: string;
  failed: boolean;
  reason: string;
  concept: string;
  logs: string[];
}
