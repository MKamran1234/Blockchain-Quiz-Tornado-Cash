import { motion } from "framer-motion";
import { shortHash } from "../lib/crypto";

export default function MerkleTreeVisualizer({ levels }: { levels: string[][] }) {
  return (
    <div className="space-y-5 overflow-x-auto pb-2">
      {[...levels].reverse().map((level, visualIndex) => (
        <div className="flex min-w-max justify-center gap-3" key={`${visualIndex}-${level.length}`}>
          {level.map((hash, index) => (
            <motion.div
              className="merkle-node"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: visualIndex * 0.08 + index * 0.02 }}
              key={`${hash}-${index}`}
            >
              {shortHash(hash, 8, 6)}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
