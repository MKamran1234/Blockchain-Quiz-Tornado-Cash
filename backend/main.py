from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from attack_simulation import (
    simulate_attacks,
    simulate_double_spend,
    simulate_fake_secret,
    simulate_invalid_proof,
)
from merkle_tree import generate_merkle_proof, get_merkle_root, verify_merkle_proof
from mixer_service import (
    MixerError,
    deposit,
    generate_proof_from_payload,
    get_dashboard,
    get_merkle_tree_view,
    get_pool,
    verify_proof,
    verify_withdrawal,
)
from models import (
    DepositRequest,
    DoubleSpendAttackRequest,
    FakeSecretAttackRequest,
    GenerateProofRequest,
    InvalidProofAttackRequest,
    PinZkpRequest,
    VerifyProofRequest,
    WithdrawRequest,
)
from zkp_pin import run_pin_zkp

import storage


app = FastAPI(
    title="ZK Privacy Mixer API",
    description="Educational Tornado Cash-inspired mixer simulation using commitments, Merkle proofs, and nullifiers.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://blockchain-quiz-tornado-cash.vercel.app",
        "https://blockchain-quiz-tornado-cash-git-main-muhammad-kamrans-projects-80d46728.vercel.app",
        "https://zk-privacy-mixer.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "ZK Privacy Mixer API is running", "docs": "/docs"}


@app.post("/api/deposit")
def create_deposit(payload: DepositRequest):
    try:
        return deposit(payload.username, payload.secret, payload.nonce)
    except MixerError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/pool")
def pool():
    return get_pool()


@app.get("/api/dashboard")
def dashboard():
    return get_dashboard()


@app.post("/api/generate-proof")
def generate_proof(payload: GenerateProofRequest):
    try:
        return generate_proof_from_payload(payload.model_dump())
    except MixerError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/withdraw")
def withdraw(payload: WithdrawRequest):
    try:
        return verify_withdrawal(payload.proof, payload.recipient)
    except MixerError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/merkle-root")
def merkle_root():
    commitments = [item["commitment"] for item in storage.commitments]
    tree = get_merkle_tree_view()
    return {"merkle_root": get_merkle_root(commitments), **tree}


@app.get("/api/merkle-proof/{index}")
def merkle_proof(index: int):
    commitments = [item["commitment"] for item in storage.commitments]
    proof = generate_merkle_proof(commitments, index)
    if proof is None:
        raise HTTPException(status_code=404, detail="Deposit index not found.")
    commitment = commitments[index]
    root = get_merkle_root(commitments)
    return {
        "index": index,
        "commitment": commitment,
        "merkle_root": root,
        "proof": proof,
        "verified": verify_merkle_proof(commitment, proof, root),
    }


@app.post("/api/verify-proof")
def verify(payload: VerifyProofRequest):
    return verify_proof(payload.proof)


@app.post("/api/pin-zkp/run")
def pin_zkp(payload: PinZkpRequest):
    return run_pin_zkp(payload.pin, payload.iterations)


@app.post("/api/attack/fake-secret")
def attack_fake_secret(payload: FakeSecretAttackRequest):
    return simulate_fake_secret(payload.deposit_index, payload.fake_secret, payload.nonce)


@app.post("/api/attack/double-spend")
def attack_double_spend(payload: DoubleSpendAttackRequest):
    return simulate_double_spend(payload.deposit_index, payload.recipient)


@app.post("/api/attack/invalid-proof")
def attack_invalid_proof(payload: InvalidProofAttackRequest):
    return simulate_invalid_proof(payload.deposit_index)


@app.get("/api/attack/simulate")
def attack_all():
    return simulate_attacks()
