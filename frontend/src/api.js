const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Request failed");
  }
  return data;
}

export const api = {
  dashboard: () => request("/api/dashboard"),
  deposit: (payload) => request("/api/deposit", { method: "POST", body: JSON.stringify(payload) }),
  pool: () => request("/api/pool"),
  generateProof: (payload) => request("/api/generate-proof", { method: "POST", body: JSON.stringify(payload) }),
  withdraw: (payload) => request("/api/withdraw", { method: "POST", body: JSON.stringify(payload) }),
  verifyProof: (payload) => request("/api/verify-proof", { method: "POST", body: JSON.stringify(payload) }),
  merkleRoot: () => request("/api/merkle-root"),
  merkleProof: (index) => request(`/api/merkle-proof/${index}`),
  pinZkp: (payload) => request("/api/pin-zkp/run", { method: "POST", body: JSON.stringify(payload) }),
  attackFakeSecret: (payload) => request("/api/attack/fake-secret", { method: "POST", body: JSON.stringify(payload) }),
  attackDoubleSpend: (payload) => request("/api/attack/double-spend", { method: "POST", body: JSON.stringify(payload) }),
  attackInvalidProof: (payload) => request("/api/attack/invalid-proof", { method: "POST", body: JSON.stringify(payload) }),
};

export function shortHash(value, start = 10, end = 8) {
  if (!value) return "pending";
  return `${String(value).slice(0, start)}...${String(value).slice(-end)}`;
}
