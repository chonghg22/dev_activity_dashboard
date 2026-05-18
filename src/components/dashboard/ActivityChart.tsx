import type { ActivityTypeMetric } from "@/lib/types";
import { activityTypeLabel, activityTypeColor } from "@/lib/format";

interface ActivityChartProps {
  metrics: ActivityTypeMetric[];
}

export default function ActivityChart({ metrics }: ActivityChartProps) {
  const total = metrics.reduce((sum, m) => sum + m.count, 0);
  if (total === 0) return null;

  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            분포
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-950">
            활동 유형 분포
          </h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
            총 {total}건
          </span>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
            수기 로그 + GitHub 활동
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {metrics.map((m) => {
          const pct = Math.round((m.count / total) * 100);
          return (
            <div key={m.activityType}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${activityTypeColor(m.activityType)}`}
                >
                  {activityTypeLabel(m.activityType)}
                </span>
                <span className="text-gray-500">
                  {m.count} ({pct}%)
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-slate-900 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
