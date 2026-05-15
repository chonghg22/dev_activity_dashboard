import Link from "next/link";
import type { PublicTimelineItem } from "@/lib/types";
import {
  activityTypeLabel,
  activityTypeColor,
  formatDate,
  sourceKindLabel,
} from "@/lib/format";

interface RecentTimelineProps {
  items: PublicTimelineItem[];
}

export default function RecentTimeline({ items }: RecentTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400 shadow-sm">
        No recent activities.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Recent Activities
        </h3>
        <Link
          href="/timeline"
          className="text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          View all &rarr;
        </Link>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={`${item.sourceKind}-${item.id}`} className="px-6 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.highlighted && (
                    <span className="mr-1 text-yellow-500">&#9733;</span>
                  )}
                  {item.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>{formatDate(item.workDate)}</span>
                  <span>&middot;</span>
                  <Link
                    href={`/projects/${item.projectSlug}`}
                    className="hover:text-gray-800"
                  >
                    {item.projectName}
                  </Link>
                  <span>&middot;</span>
                  <span>{sourceKindLabel(item.sourceKind)}</span>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${activityTypeColor(item.activityType)}`}
              >
                {activityTypeLabel(item.activityType)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
