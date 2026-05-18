import Link from "next/link";
import type { PublicTimelineItem } from "@/lib/types";
import {
  activityTypeLabel,
  activityTypeColor,
  formatDate,
  sourceKindLabel,
} from "@/lib/format";

interface TimelineItemProps {
  item: PublicTimelineItem;
}

export default function TimelineItem({ item }: TimelineItemProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-stone-950">
            {item.highlighted && (
              <span className="mr-1 text-stone-500">&#9733;</span>
            )}
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">
            {item.content}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span>{formatDate(item.workDate)}</span>
            <span>&middot;</span>
            <Link
              href={`/projects/${item.projectSlug}`}
              className="text-stone-600 hover:text-stone-900"
            >
              {item.projectName}
            </Link>
            <span>&middot;</span>
            <span>{sourceKindLabel(item.sourceKind)}</span>
          </div>
          {item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-stone-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${activityTypeColor(item.activityType)}`}
        >
          {activityTypeLabel(item.activityType)}
        </span>
      </div>
    </div>
  );
}
