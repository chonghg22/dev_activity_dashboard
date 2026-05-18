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
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
        최근 활동이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            스트림
          </p>
          <h3 className="mt-2 text-lg font-semibold text-stone-950">
            최근 활동
          </h3>
        </div>
        <Link
          href="/timeline"
          className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-stone-300 hover:bg-white hover:text-stone-900"
        >
          전체 보기 &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={`${item.sourceKind}-${item.id}`}
            className="flex h-full flex-col justify-between rounded-xl border border-stone-200 bg-stone-50/60 p-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-stone-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-stone-500">
                      {sourceKindLabel(item.sourceKind)}
                    </span>
                    {item.highlighted ? (
                      <span className="rounded-full border border-stone-300 bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                        하이라이트
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-sm font-semibold leading-6 text-stone-950">
                    {item.title}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${activityTypeColor(item.activityType)}`}
                >
                  {activityTypeLabel(item.activityType)}
                </span>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-stone-600">
                {item.content}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="rounded-full bg-white px-2 py-1">
                {formatDate(item.workDate)}
              </span>
              <Link
                href={`/projects/${item.projectSlug}`}
                className="font-medium hover:text-stone-900"
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
