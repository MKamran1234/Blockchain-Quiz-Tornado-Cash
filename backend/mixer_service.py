from collections import Counter
from typing import Any, Dict, List

from crypto_utils import (
    create_commitment,
    create_nullifier,
    generate_nonce,
    generate_secret,
    now_iso,
)
from merkle_tree import build_merkle_tree, generate_merkle_proof, get_merkle_root, verify_merkle_proof
import storage


class MixerError(ValueError):
    pass


def _commitment_values() -> List[str]:
    return [item["commitment"] for item in storage.commitments]


def _find_deposit_by_commitment(commitment: str) -> Dict[str, Any] | None:
    return next((item for item in storage.commitments if item["commitment"] == commitment), None)


def _find_deposit_index(commitment: str) -> int:
    for index, item in enumerate(storage.commitments):
        if item["commitment"] == commitment:
            return index
    return -1


def deposit(username: str, secret: str | None = None, nonce: str | None = None) -> Dict[str, Any]:
    secret = secret or generate_secret()
    nonce = nonce or generate_nonce()
    commitment = create_commitment(secret, nonce)

    if _find_deposit_by_commitment(commitment):
        raise MixerError("A deposit with this commitment already exists.")

    index = len(storage.commitments)
    record = {
        "index": index,
        "username": username,
        "commitment": commitment,
        "timestamp": now_iso(),
        "status": "unspent",
    }
    storage.commitments.append(record)
    storage.events.insert(
        0,
        {
            "type": "deposit",
            "status": "success",
            "commitment": commitment,
            "timestamp": record["timestamp"],
        },
    )

    note = {
        "username": username,
        "secret": secret,
        "nonce": nonce,
        "commitment": commitment,
        "deposit_index": index,
    }
    return {
        "message": "Anonymous deposit created successfully",
        "username": username,
        "secret": secret,
        "nonce": nonce,
        "commitment": commitment,
        "deposit_index": index,
        "merkle_root": get_merkle_root(_commitment_values()),
        "note": note,
    }


def get_pool() -> Dict[str, Any]:
    public_records = [
        {
            "index": item["index"],
            "commitment": item["commitment"],
            "timestamp": item["timestamp"],
            "status": item["status"],
        }
        for item in storage.commitments
    ]
    return {
        "anonymity_set_size": len(storage.commitments),
        "commitments": public_records,
    }


def generate_proof(secret: str, nonce: str, commitment_hint: str | None = None) -> Dict[str, Any]:
    commitment = create_commitment(secret, nonce)
    if commitment_hint and commitment_hint != commitment:
        raise MixerError("Provided commitment does not match the secret and nonce.")

    deposit_index = _find_deposit_index(commitment)
    if deposit_index == -1:
        raise MixerError("Commitment does not exist in the mixing pool.")

    commitments = _commitment_values()
    proof_path = generate_merkle_proof(commitments, deposit_index)
    root = get_merkle_root(commitments)
    nullifier_hash = create_nullifier(secret, nonce)

    proof = {
        "commitment": commitment,
        "deposit_index": deposit_index,
        "nullifier_hash": nullifier_hash,
        "merkle_root": root,
        "merkle_proof": proof_path,
        "membership_verified": verify_merkle_proof(commitment, proof_path or [], root),
        "proof_statement": "I know the secret and nonce that open this commitment, and this commitment is in the Merkle tree.",
    }
    return {
        "message": "Proof generated successfully",
        "proof": proof,
    }


def generate_proof_from_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    note = payload.get("note") or {}
    secret = payload.get("secret") or note.get("secret")
    nonce = payload.get("nonce") or note.get("nonce")
    commitment = payload.get("commitment") or note.get("commitment")

    if not secret or not nonce:
        raise MixerError("Secret and nonce are required to generate a proof.")

    return generate_proof(secret, nonce, commitment)


def verify_proof(proof: Dict[str, Any]) -> Dict[str, Any]:
    commitment = proof.get("commitment")
    proof_path = proof.get("merkle_proof")
    root = proof.get("merkle_root")
    nullifier_hash = proof.get("nullifier_hash")

    if not commitment or not isinstance(proof_path, list) or not root or not nullifier_hash:
        return {"valid": False, "reason": "Proof object is missing required fields."}

    deposit_record = _find_deposit_by_commitment(commitment)
    if not deposit_record:
        return {"valid": False, "reason": "Commitment is not in the mixing pool."}
    if deposit_record.get("status") == "spent":
        return {"valid": False, "reason": "Withdrawal rejected: double spending detected."}

    current_root = get_merkle_root(_commitment_values())
    if root != current_root:
        return {"valid": False, "reason": "Merkle root does not match the current pool root."}

    if not verify_merkle_proof(commitment, proof_path, root):
        return {"valid": False, "reason": "Merkle proof verification failed."}

    if nullifier_hash in storage.nullifiers_used:
        return {"valid": False, "reason": "Withdrawal rejected: double spending detected."}

    return {
        "valid": True,
        "reason": "Proof is valid and nullifier is unused.",
        "deposit": deposit_record,
    }


def verify_withdrawal(proof: Dict[str, Any], recipient: str) -> Dict[str, Any]:
    result = verify_proof(proof)
    if not result["valid"]:
        raise MixerError(result["reason"])

    deposit_record = result["deposit"]
    deposit_record["status"] = "spent"
    storage.nullifiers_used.add(proof["nullifier_hash"])

    withdrawal = {
        "recipient": recipient,
        "commitment": proof["commitment"],
        "nullifier_hash": proof["nullifier_hash"],
        "timestamp": now_iso(),
        "status": "completed",
    }
    storage.withdrawals.append(withdrawal)
    storage.events.insert(0, {"type": "withdrawal", **withdrawal})

    return {
        "message": "Withdrawal verified and completed successfully",
        "withdrawal": withdrawal,
    }


def prevent_double_spending(nullifier_hash: str) -> bool:
    return nullifier_hash not in storage.nullifiers_used


def get_dashboard() -> Dict[str, Any]:
    event_counts = Counter(event["type"] for event in storage.events)
    chart = [
        {"name": "Deposits", "count": event_counts.get("deposit", 0)},
        {"name": "Withdrawals", "count": event_counts.get("withdrawal", 0)},
        {"name": "Used Nullifiers", "count": len(storage.nullifiers_used)},
    ]
    return {
        "total_deposits": len(storage.commitments),
        "total_withdrawals": len(storage.withdrawals),
        "total_nullifiers_used": len(storage.nullifiers_used),
        "anonymity_set_size": len(storage.commitments),
        "merkle_root": get_merkle_root(_commitment_values()),
        "system_status": "Educational demo online",
        "recent_transactions": storage.events[:8],
        "chart": chart,
    }


def get_merkle_tree_view() -> Dict[str, Any]:
    commitments = _commitment_values()
    levels = build_merkle_tree(commitments)
    return {
        "root": get_merkle_root(commitments),
        "levels": levels,
        "leaf_count": len(commitments),
    }
