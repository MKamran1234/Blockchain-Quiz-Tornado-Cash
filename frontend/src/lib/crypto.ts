import type { MerkleBuild, MerkleProofItem, MerkleVerification } from "../types";

const encoder = new TextEncoder();

export async function sha256(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function randomHex(bytes: number): string {
  const values = new Uint8Array(bytes);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function generateSecret(): string {
  return `secret_${randomHex(24)}`;
}

export function generateNonce(): string {
  return `nonce_${randomHex(16)}`;
}

export async function createCommitment(secret: string, nonce: string): Promise<string> {
  // The demo commitment hides the witness by storing only SHA-256(secret + nonce).
  return sha256(`${secret}${nonce}`);
}

export async function createNullifier(secret: string): Promise<string> {
  // A nullifier is deterministic for the secret, so the same note cannot be spent twice.
  return sha256(`${secret}nullifier`);
}

export function shortHash(value?: string, start = 10, end = 8): string {
  if (!value) return "pending";
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

async function hashPair(left: string, right: string): Promise<string> {
  return sha256(`node:${left}:${right}`);
}

async function hashLeaf(leaf: string): Promise<string> {
  return sha256(`leaf:${leaf}`);
}

export async function buildMerkleTree(leaves: string[]): Promise<MerkleBuild> {
  if (leaves.length === 0) {
    const empty = await sha256("empty-tree");
    return { root: empty, levels: [[empty]], leaves: [] };
  }

  const levels: string[][] = [await Promise.all(leaves.map(hashLeaf))];
  let current = levels[0];

  while (current.length > 1) {
    const next: string[] = [];
    for (let index = 0; index < current.length; index += 2) {
      const left = current[index];
      const right = current[index + 1] ?? left;
      next.push(await hashPair(left, right));
    }
    levels.push(next);
    current = next;
  }

  return { root: levels[levels.length - 1][0], levels, leaves };
}

export async function generateProof(leaves: string[], leafIndex: number): Promise<MerkleProofItem[]> {
  const tree = await buildMerkleTree(leaves);
  if (leafIndex < 0 || leafIndex >= leaves.length) return [];

  const proof: MerkleProofItem[] = [];
  let cursor = leafIndex;

  for (const level of tree.levels.slice(0, -1)) {
    const siblingIndex = cursor % 2 === 0 ? cursor + 1 : cursor - 1;
    const siblingHash = level[siblingIndex] ?? level[cursor];
    proof.push({
      siblingHash,
      direction: cursor % 2 === 0 ? "right" : "left",
    });
    cursor = Math.floor(cursor / 2);
  }

  return proof;
}

export async function reconstructRoot(leaf: string, proof: MerkleProofItem[]): Promise<string> {
  let computed = await hashLeaf(leaf);

  for (const item of proof) {
    computed = item.direction === "left"
      ? await hashPair(item.siblingHash, computed)
      : await hashPair(computed, item.siblingHash);
  }

  return computed;
}

export async function verifyProof(leaf: string, proof: MerkleProofItem[], root: string): Promise<boolean> {
  return (await reconstructRoot(leaf, proof)) === root;
}

export async function verifyLeaf(leaves: string[], leafIndex: number): Promise<MerkleVerification> {
  const tree = await buildMerkleTree(leaves);
  const proof = await generateProof(leaves, leafIndex);
  const leaf = leaves[leafIndex];
  const reconstructedRoot = await reconstructRoot(leaf, proof);
  return {
    leaf,
    leafIndex,
    proof,
    reconstructedRoot,
    actualRoot: tree.root,
    verified: reconstructedRoot === tree.root,
  };
}
