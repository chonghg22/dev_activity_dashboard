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
      <h1 className="text-2xl font-bold text-gray-900">프로젝트</h1>

      {data.content.length === 0 ? (
        <p className="text-sm text-gray-400">아직 공개된 프로젝트가 없습니다.</p>
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
