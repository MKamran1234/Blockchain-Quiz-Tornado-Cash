import GlassCard from "./GlassCard";

export default function ExplanationCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="p-5">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-slate-300">{children}</div>
    </GlassCard>
  );
}
