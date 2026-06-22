from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DepositRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=80)
    secret: Optional[str] = None
    nonce: Optional[str] = None


class DepositResponse(BaseModel):
    message: str
    username: str
    secret: str
    nonce: str
    commitment: str
    deposit_index: int
    merkle_root: str
    note: Dict[str, Any]


class GenerateProofRequest(BaseModel):
    secret: Optional[str] = None
    nonce: Optional[str] = None
    commitment: Optional[str] = None
    note: Optional[Dict[str, Any]] = None


class VerifyProofRequest(BaseModel):
    proof: Dict[str, Any]


class WithdrawRequest(BaseModel):
    proof: Dict[str, Any]
    recipient: str = Field(..., min_length=1, max_length=120)


class PinZkpRequest(BaseModel):
    pin: str = Field(..., pattern=r"^\d{4}$")
    iterations: int = Field(default=100, ge=1, le=1000)


class FakeSecretAttackRequest(BaseModel):
    deposit_index: int = Field(default=0, ge=0)
    fake_secret: str = "wrong-secret"
    nonce: Optional[str] = None


class DoubleSpendAttackRequest(BaseModel):
    deposit_index: int = Field(default=0, ge=0)
    recipient: str = "attacker-wallet"


class InvalidProofAttackRequest(BaseModel):
    deposit_index: int = Field(default=0, ge=0)


class ApiMessage(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None


class PoolResponse(BaseModel):
    anonymity_set_size: int
    commitments: List[Dict[str, Any]]


class DashboardResponse(BaseModel):
    total_deposits: int
    total_withdrawals: int
    total_nullifiers_used: int
    anonymity_set_size: int
    merkle_root: str
    system_status: str
    recent_transactions: List[Dict[str, Any]]
    chart: List[Dict[str, Any]]
