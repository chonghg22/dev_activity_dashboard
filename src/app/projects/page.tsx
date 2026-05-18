export const dynamic = "force-dynamic";

import { fetchPublicProjects } from "@/lib/api";
import ProjectCard from "@/components/project/ProjectCard";
import Pagination from "@/components/timeline/Pagination";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(0, Number(params.page ?? 0));
  const data = await fetchPublicProjects(page, 12);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
          Directory
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
          프로젝트
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          공개 상태로 설정된 프로젝트 목록입니다. 각 항목에서 설명과 상세
          활동 기록으로 이동할 수 있습니다.
        </p>
      </section>

      {data.content.length === 0 ? (
        <p className="text-sm text-stone-500">아직 공개된 프로젝트가 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            basePath="/projects"
          />
        </>
      )}
    </div>
  );
}
