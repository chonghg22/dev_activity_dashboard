export const dynamic = "force-dynamic";

import { fetchTimeline, fetchPublicProjects } from "@/lib/api";
import TimelineItem from "@/components/timeline/TimelineItem";
import TimelineFilter from "@/components/timeline/TimelineFilter";
import Pagination from "@/components/timeline/Pagination";

interface Props {
  searchParams: Promise<{
    page?: string;
    projectSlug?: string;
    activityType?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function TimelinePage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0));

  const [data, projects] = await Promise.all([
    fetchTimeline({
      page,
      size: 20,
      projectSlug: params.projectSlug,
      activityType: params.activityType,
      from: params.from,
      to: params.to,
    }),
    fetchPublicProjects(0, 100),
  ]);

  const extraParams: Record<string, string> = {};
  if (params.projectSlug) extraParams.projectSlug = params.projectSlug;
  if (params.activityType) extraParams.activityType = params.activityType;
  if (params.from) extraParams.from = params.from;
  if (params.to) extraParams.to = params.to;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>

      <TimelineFilter
        projects={projects.content}
        currentProjectSlug={params.projectSlug}
        currentActivityType={params.activityType}
        currentFrom={params.from}
        currentTo={params.to}
      />

      {data.content.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-400">
          No activities found.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {data.content.map((item) => (
              <TimelineItem key={`${item.sourceKind}-${item.id}`} item={item} />
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/timeline"
            extraParams={extraParams}
          />
        </>
      )}
    </div>
  );
}
