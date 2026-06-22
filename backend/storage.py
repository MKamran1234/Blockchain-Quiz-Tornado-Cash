from typing import Dict, List, Set


commitments: List[Dict] = []
withdrawals: List[Dict] = []
nullifiers_used: Set[str] = set()
events: List[Dict] = []


def reset_demo_state() -> None:
    commitments.clear()
    withdrawals.clear()
    nullifiers_used.clear()
    events.clear()
