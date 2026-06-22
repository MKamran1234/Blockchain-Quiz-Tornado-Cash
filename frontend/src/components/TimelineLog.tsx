import type { VerificationLog } from "../types";

export default function TimelineLog({ logs }: { logs: VerificationLog[] }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div className="timeline-item" key={log.id}>
          <span className={`status-dot status-${log.status}`} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-white">{log.action}</p>
              <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-300">{log.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
