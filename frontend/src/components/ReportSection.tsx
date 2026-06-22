import GlassCard from "./GlassCard";

export default function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="break-inside-avoid p-5 print:border-slate-300 print:bg-white print:text-slate-950">
      <h2 className="text-xl font-bold text-white print:text-slate-950">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-300 print:text-slate-700">{children}</div>
    </GlassCard>
  );
}
