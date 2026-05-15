import {
  fetchRecentTimeline,
  fetchPublicProjects,
  fetchStatsSummary,
} from "@/lib/api";
import SummaryCard from "@/components/dashboard/SummaryCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import RecentTimeline from "@/components/dashboard/RecentTimeline";
import ProjectCard from "@/components/project/ProjectCard";

export default async function HomePage() {
  const [stats, timeline, projects] = await Promise.all([
    fetchStatsSummary(),
    fetchRecentTimeline(),
    fetchPublicProjects(0, 6),
  ]);

  if (!stats) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-gray-400">
          Unable to connect to the API server.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Make sure the backend is running.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Public Projects"
          value={stats.publicProjectCount}
          icon="&#128194;"
        />
        <SummaryCard
          label="Total Activities"
          value={stats.publicManualLogCount}
          icon="&#128221;"
        />
        <SummaryCard
          label="Highlights"
          value={stats.highlightedLogCount}
          icon="&#11088;"
        />
      </section>

      {/* 프로젝트 카드 */}
      {projects.content.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Projects
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.content.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* 활동 분포 + 최근 타임라인 */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ActivityChart metrics={stats.activityTypeCounts} />
        </div>
        <div className="lg:col-span-2">
          <RecentTimeline items={timeline.content} />
        </div>
      </section>
    </div>
  );
}
