import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value }: { icon?: LucideIcon; label: string; value: React.ReactNode }) {
  return (
    <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 break-all text-2xl font-bold text-white">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg border border-teal-300/20 bg-teal-300/10 p-3 text-teal-200">
            <Icon size={22} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
