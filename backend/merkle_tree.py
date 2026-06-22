from typing import List, Optional

from crypto_utils import sha256_hash


EMPTY_ROOT = sha256_hash("empty-tree")


def hash_leaf(commitment: str) -> str:
    return sha256_hash(f"leaf:{commitment}")


def hash_pair(left: str, right: str) -> str:
    return sha256_hash(f"node:{left}:{right}")


def build_merkle_tree(commitments: List[str]) -> List[List[str]]:
    if not commitments:
        return [[EMPTY_ROOT]]

    levels = [[hash_leaf(commitment) for commitment in commitments]]
    current = levels[0]

    while len(current) > 1:
        next_level = []
        for index in range(0, len(current), 2):
            left = current[index]
            right = current[index + 1] if index + 1 < len(current) else left
            next_level.append(hash_pair(left, right))
        levels.append(next_level)
        current = next_level

    return levels


def get_merkle_root(commitments: List[str]) -> str:
    return build_merkle_tree(commitments)[-1][0]


def generate_merkle_proof(commitments: List[str], index: int) -> Optional[List[dict]]:
    if index < 0 or index >= len(commitments):
        return None

    levels = build_merkle_tree(commitments)
    proof = []
    cursor = index

    for level in levels[:-1]:
        sibling_index = cursor - 1 if cursor % 2 else cursor + 1
        sibling = level[sibling_index] if sibling_index < len(level) else level[cursor]
        proof.append(
            {
                "position": "left" if cursor % 2 else "right",
                "hash": sibling,
            }
        )
        cursor //= 2

    return proof


def verify_merkle_proof(leaf_commitment: str, proof: List[dict], root: str) -> bool:
    computed = hash_leaf(leaf_commitment)

    for item in proof:
        sibling_hash = item.get("hash")
        position = item.get("position")
        if not sibling_hash or position not in {"left", "right"}:
            return False
        if position == "left":
            computed = hash_pair(sibling_hash, computed)
        else:
            computed = hash_pair(computed, sibling_hash)

    return computed == root
