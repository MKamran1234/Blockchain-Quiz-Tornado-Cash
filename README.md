# ZK Privacy Mixer - Privacy-Preserving Transaction System

ZK Privacy Mixer is a professional academic web application that demonstrates a simplified Tornado Cash-inspired privacy flow using SHA-256 commitments, Merkle trees, nullifiers, anonymity sets, and proof verification.

This project is for education only. It is not a production mixer, not a real zkSNARK implementation, and must not be used with real funds.

## Overview

The system lets a user deposit into a public mixing pool by creating a secret, nonce, and SHA-256 commitment. Later, the user withdraws by submitting a proof object that shows the commitment belongs to the Merkle tree and that the nullifier has not been used before. The UI includes dashboard statistics, proof generation, Merkle proof visualization, attacks, and a 100-iteration 4-digit PIN zero-knowledge demo.

## Features

- Modern React dashboard with dark blockchain-style UI
- FastAPI backend with clean REST endpoints
- SHA-256 secret and nonce commitments
- In-memory commitment pool
- Merkle tree construction, root generation, proof generation, and proof verification
- Nullifier-based double-spending prevention
- Proof JSON viewer and copy buttons
- Deposit note generation and download
- Mixing pool table with only public commitments
- 4-digit PIN zero-knowledge challenge demo with 100 rounds
- Attack simulation for fake secret, double spending, and invalid Merkle proof
- Educational explanation page with Roman Urdu viva answer

## Technologies Used

Frontend:

- React.js with Vite
- Tailwind CSS
- Framer Motion
- Lucide React icons
- Recharts
- LocalStorage for demo notes/proofs

Backend:

- Python FastAPI
- Uvicorn
- Pydantic
- Python `hashlib` SHA-256
- In-memory demo storage

## Folder Structure

```text
zk-privacy-mixer/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── storage.py
│   ├── crypto_utils.py
│   ├── merkle_tree.py
│   ├── zkp_pin.py
│   ├── mixer_service.py
│   ├── attack_simulation.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── components/
│       ├── pages/
│       └── styles/
├── README.md
└── screenshots/
```

## Setup Instructions

Open two terminals from the project root:

```bash
cd zk-privacy-mixer
```

Backend setup:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The backend runs at:

```text
http://localhost:8000
```

API docs are available at:

```text
http://localhost:8000/docs
```

Frontend setup:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## API Endpoints

```text
POST /api/deposit
GET  /api/pool
GET  /api/dashboard
POST /api/generate-proof
POST /api/withdraw
GET  /api/merkle-root
GET  /api/merkle-proof/{index}
POST /api/verify-proof
POST /api/pin-zkp/run
POST /api/attack/fake-secret
POST /api/attack/double-spend
POST /api/attack/invalid-proof
```

## Backend Logic

- `generate_secret()` creates a cryptographically random secret.
- `create_commitment(secret, nonce)` creates a SHA-256 commitment for the deposit.
- `create_nullifier(secret, nonce)` creates a nullifier used to stop double spending.
- `build_merkle_tree(commitments)` hashes all commitments into a Merkle tree.
- `generate_merkle_proof(index)` returns the sibling path for a leaf.
- `verify_merkle_proof(leaf, proof, root)` verifies membership.
- `generate_proof(secret, nonce)` builds a demo proof object.
- `verify_withdrawal(proof)` checks membership, current root, and nullifier status.
- `run_pin_zkp(pin, iterations=100)` simulates repeated challenge-response verification.

## Assignment Mapping

| Assignment Requirement     | Implemented In           |
| -------------------------- | ------------------------ |
| Secret generation          | Deposit module           |
| SHA-256 commitment         | Backend crypto utilities |
| Commitment storage         | Mixing pool              |
| Proof generation           | Generate Proof page      |
| Proof verification         | Withdrawal module        |
| Multiple users             | Deposit module           |
| Mixing pool                | Pool page                |
| Double spending prevention | Nullifier logic          |
| Merkle Tree                | Merkle Tree module       |
| 100-iteration PIN ZKP      | PIN ZKP Demo             |
| Attack simulation          | Attack Simulation page   |

## How To Demo

1. Start the backend and frontend.
2. Open the dashboard.
3. Go to Deposit and create deposits for multiple users.
4. Save or copy the deposit note.
5. Go to Mixing Pool and show that only commitments are public.
6. Go to Generate Proof and use the saved note.
7. Go to Withdraw and submit the proof with a recipient wallet.
8. Submit the same proof again to show double-spending rejection.
9. Open Merkle Tree and verify at least 3 leaves.
10. Run the PIN ZKP demo for 100 iterations.
11. Run all attack simulations.

## Screenshots Guidance

For submission, take screenshots of:

- Dashboard with stats and chart
- Deposit note success screen
- Mixing pool with multiple commitments
- Proof generation JSON
- Successful withdrawal
- Rejected double-spend attempt
- Merkle tree proof verification for 3 leaves
- PIN ZKP result with `(1/2)^100`
- Attack simulation results
- How It Works page

Save them inside the `screenshots/` folder.

## Limitations

- This is an educational simulation, not a real zero-knowledge circuit.
- Proofs are transparent JSON objects, not zkSNARK proofs.
- Storage is in memory and resets when the backend restarts.
- There is no real blockchain, wallet signature, smart contract, or token transfer.
- A production mixer would need audited smart contracts, zkSNARK circuits, relayers, and strong operational security.

## Future Improvements

- Add persistent database storage
- Add wallet signature simulation
- Add real Circom/snarkjs proof generation
- Add smart contract deployment on a local chain
- Add relayer fee simulation
- Add screenshot export/report generation

## Viva-Ready Explanation

Is system mein user deposit ke waqt apna secret directly blockchain par store nahi karta. System sirf secret aur nonce ka hash commitment store karta hai. Withdrawal ke waqt user proof deta hai ke us ke paas original secret aur nonce hain, aur us ka commitment Merkle tree ka member hai. Public ko original secret reveal nahi hota. Nullifier double spending ko prevent karta hai, kyun ke aik nullifier sirf aik dafa use ho sakta hai. Yeh project educational simulation hai, real Tornado Cash jaisa production zkSNARK system nahi.
