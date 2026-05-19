export const revalidate = 300;

import { fetchTimeline, fetchPublicProjects } from "@/lib/api";
import TimelineItem from "@/components/timeline/TimelineItem";
import TimelineFilter from "@/components/timeline/TimelineFilter";
import Pagination from "@/components/timeline/Pagination";

interface Props {
  searchParams: Promise<{
    page?: string;
    keyword?: string;
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
      keyword: params.keyword,
      projectSlug: params.projectSlug,
      activityType: params.activityType,
      from: params.from,
      to: params.to,
    }),
    fetchPublicProjects(0, 100),
  ]);

  const extraParams: Record<string, string> = {};
  if (params.keyword) extraParams.keyword = params.keyword;
  if (params.projectSlug) extraParams.projectSlug = params.projectSlug;
  if (params.activityType) extraParams.activityType = params.activityType;
  if (params.from) extraParams.from = params.from;
  if (params.to) extraParams.to = params.to;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
          Activity Log
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
          타임라인
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          공개 가능한 활동 기록을 날짜, 프로젝트, 활동 유형 기준으로
          정리해서 볼 수 있습니다.
        </p>
      </section>

      <TimelineFilter
        projects={projects.content}
        currentKeyword={params.keyword}
        currentProjectSlug={params.projectSlug}
        currentActivityType={params.activityType}
        currentFrom={params.from}
        currentTo={params.to}
      />

      {data.content.length === 0 ? (
        <p className="py-12 text-center text-sm text-stone-500">
          조건에 맞는 활동 기록이 없습니다.
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
