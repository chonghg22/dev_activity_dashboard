export const revalidate = 300;

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
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-950">
            {project.name}
          </h1>
          <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600">
            {project.category}
          </span>
        </div>
        {project.description && (
          <p className="text-sm leading-6 text-stone-600">{project.description}</p>
        )}
        {(project.startedOn || project.endedOn) && (
          <p className="mt-3 text-sm text-stone-500">
            {project.startedOn && formatDate(project.startedOn)}
            {project.startedOn && project.endedOn && " ~ "}
            {project.endedOn && formatDate(project.endedOn)}
            {project.startedOn && !project.endedOn && " ~ 진행 중"}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">
          활동 타임라인
        </h2>
        <RecentTimeline items={timeline.content} />
      </section>
    </div>
  );
}
