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
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {item.highlighted && (
              <span className="mr-1 text-yellow-500">&#9733;</span>
            )}
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
            {item.content}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span>{formatDate(item.workDate)}</span>
            <span>&middot;</span>
            <Link
              href={`/projects/${item.projectSlug}`}
              className="text-gray-500 hover:text-gray-800"
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
                  className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500"
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
