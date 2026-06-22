import { motion } from "framer-motion";
import type { UserDeposit } from "../types";
import { shortHash } from "../lib/crypto";

export default function MixingPool({ deposits }: { deposits: UserDeposit[] }) {
  return (
    <div className="pool-canvas">
      {deposits.map((deposit, index) => (
        <motion.div
          className={`pool-node ${deposit.withdrawn ? "opacity-55" : ""}`}
          key={deposit.id}
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ delay: index * 0.035, y: { repeat: Infinity, duration: 5 + (index % 4), ease: "easeInOut" } }}
          title={`${deposit.userLabel} • ${new Date(deposit.timestamp).toLocaleString()} • ${deposit.withdrawn ? "withdrawn" : "active"}`}
        >
          <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">commitment</span>
          <span className="mt-2 block font-mono text-xs text-teal-100">{shortHash(deposit.commitment, 10, 8)}</span>
          <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] ${deposit.withdrawn ? "bg-slate-500/15 text-slate-300" : "bg-emerald-300/10 text-emerald-200"}`}>
            {deposit.withdrawn ? "spent" : "active"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
