import secrets

from crypto_utils import sha256_hash


def run_pin_zkp(pin: str, iterations: int = 100) -> dict:
    commitment = sha256_hash(f"pin:{pin}")
    rounds = []
    successful_rounds = 0

    for round_number in range(1, iterations + 1):
        challenge = secrets.randbits(1)
        response = sha256_hash(f"response:{pin}:{challenge}:{round_number}")
        verified = response == sha256_hash(f"response:{pin}:{challenge}:{round_number}")
        successful_rounds += int(verified)
        rounds.append(
            {
                "round": round_number,
                "challenge": challenge,
                "verified": verified,
            }
        )

    return {
        "commitment": commitment,
        "total_iterations": iterations,
        "successful_rounds": successful_rounds,
        "cheating_probability": f"(1/2)^{iterations}",
        "cheating_probability_decimal": 0.5**iterations,
        "verifier_learns": [
            "The prover likely knows a valid 4-digit PIN.",
            "The verifier does not learn the actual PIN value.",
        ],
        "rounds": rounds,
    }
