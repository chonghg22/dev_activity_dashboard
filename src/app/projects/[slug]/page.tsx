export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { fetchProjectDetail, fetchTimeline } from "@/lib/api";
import RecentTimeline from "@/components/dashboard/RecentTimeline";
import { formatDate } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = await fetchProjectDetail(slug);
  if (!project) {
    notFound();
  }

  const timeline = await fetchTimeline({ projectSlug: slug, page: 0, size: 20 });

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {project.category}
          </span>
        </div>
        {project.description && (
          <p className="text-gray-600">{project.description}</p>
        )}
        {(project.startedOn || project.endedOn) && (
          <p className="mt-2 text-sm text-gray-400">
            {project.startedOn && formatDate(project.startedOn)}
            {project.startedOn && project.endedOn && " ~ "}
            {project.endedOn && formatDate(project.endedOn)}
            {project.startedOn && !project.endedOn && " ~ 진행 중"}
          </p>
        )}
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          활동 타임라인
        </h2>
        <RecentTimeline items={timeline.content} />
      </section>
    </div>
  );
}
