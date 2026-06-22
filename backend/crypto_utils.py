import hashlib
import secrets
from datetime import datetime, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def generate_secret() -> str:
    return secrets.token_hex(32)


def generate_nonce() -> str:
    return secrets.token_hex(16)


def sha256_hash(data: str) -> str:
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def create_commitment(secret: str, nonce: str) -> str:
    return sha256_hash(f"commitment:{secret}:{nonce}")


def create_nullifier(secret: str, nonce: str) -> str:
    return sha256_hash(f"nullifier:{secret}:{nonce}")
