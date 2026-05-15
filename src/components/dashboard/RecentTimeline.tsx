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
      <div className="rounded-2xl border border-white/70 bg-white/90 p-6 text-center text-sm text-gray-400 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
        No recent activities.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
      <div className="flex items-center justify-between border-b border-gray-100/80 px-6 py-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            Stream
          </p>
          <h3 className="mt-2 text-lg font-semibold text-gray-950">
            Recent Activities
          </h3>
        </div>
        <Link
          href="/timeline"
          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-900"
        >
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={`${item.sourceKind}-${item.id}`}
            className="flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-[linear-gradient(180deg,#ffffff_0%,#fafaf9_100%)] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                      {sourceKindLabel(item.sourceKind)}
                    </span>
                    {item.highlighted ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        Highlight
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold leading-6 text-gray-950">
                    {item.title}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${activityTypeColor(item.activityType)}`}
                >
                  {activityTypeLabel(item.activityType)}
                </span>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                {item.content}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-2 py-1">
                {formatDate(item.workDate)}
              </span>
              <Link
                href={`/projects/${item.projectSlug}`}
                className="font-medium hover:text-gray-800"
              >
                {item.projectName}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
