import type { ActivityTypeMetric } from "@/lib/types";
import { activityTypeLabel, activityTypeColor } from "@/lib/format";

interface ActivityChartProps {
  metrics: ActivityTypeMetric[];
}

export default function ActivityChart({ metrics }: ActivityChartProps) {
  const total = metrics.reduce((sum, m) => sum + m.count, 0);
  if (total === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Activity Distribution
      </h3>
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
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-800 transition-all"
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
