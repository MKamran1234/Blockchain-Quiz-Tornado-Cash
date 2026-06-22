from crypto_utils import generate_nonce
from mixer_service import MixerError, deposit, generate_proof, verify_withdrawal
import storage


def _ensure_deposit(index: int = 0) -> dict:
    if not storage.commitments:
        deposit("demo-user")
    if index >= len(storage.commitments):
        index = 0
    return storage.commitments[index]


def simulate_fake_secret(deposit_index: int = 0, fake_secret: str = "wrong-secret", nonce: str | None = None) -> dict:
    target = _ensure_deposit(deposit_index)
    try:
        generate_proof(fake_secret, nonce or generate_nonce(), target["commitment"])
        return {"attack": "Fake Secret", "blocked": False, "message": "Unexpectedly accepted fake secret."}
    except MixerError as exc:
        return {"attack": "Fake Secret", "blocked": True, "message": f"Rejected as expected: {exc}"}


def simulate_double_spend(deposit_index: int = 0, recipient: str = "attacker-wallet") -> dict:
    note = deposit(f"double-spend-demo-{len(storage.commitments) + 1}")["note"]
    proof = generate_proof(note["secret"], note["nonce"], note["commitment"])["proof"]

    first = verify_withdrawal(proof, recipient)
    try:
        verify_withdrawal(proof, recipient)
        return {
            "attack": "Double Spending",
            "blocked": False,
            "first_attempt": first,
            "message": "Unexpectedly accepted the second withdrawal.",
        }
    except MixerError as exc:
        return {
            "attack": "Double Spending",
            "blocked": True,
            "first_attempt": first,
            "message": str(exc),
        }


def simulate_invalid_proof(deposit_index: int = 0) -> dict:
    if len(storage.commitments) < 1:
        deposit("invalid-proof-anchor")
    note = deposit(f"invalid-proof-demo-{len(storage.commitments) + 1}")["note"]
    proof = generate_proof(note["secret"], note["nonce"], note["commitment"])["proof"]
    if proof["merkle_proof"]:
        proof["merkle_proof"][0]["hash"] = "0" * 64
    else:
        proof["merkle_root"] = "0" * 64

    try:
        verify_withdrawal(proof, "attacker-wallet")
        return {"attack": "Invalid Merkle Proof", "blocked": False, "message": "Unexpectedly accepted tampered proof."}
    except MixerError as exc:
        return {"attack": "Invalid Merkle Proof", "blocked": True, "message": f"Verification failed as expected: {exc}"}


def simulate_attacks() -> dict:
    return {
        "results": [
            simulate_fake_secret(),
            simulate_double_spend(),
            simulate_invalid_proof(),
        ]
    }
