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
    fetchRecentTimeline(6),
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
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,251,235,0.92),rgba(255,255,255,0.9)_45%,rgba(241,245,249,0.95))] px-6 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_52%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
              Public Portfolio Snapshot
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              A curated timeline of projects, manual logs, and synced delivery
              signals.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Dev Activity Hub surfaces visible project work with a backend-first
              lens: what was built, where effort accumulated, and which records
              are worth highlighting.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                Sources
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-950">2</p>
              <p className="mt-1 text-xs text-gray-500">Manual logs + GitHub sync</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                Coverage
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-950">
                {stats.publicProjectCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">Public active projects</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Public Projects"
          value={stats.publicProjectCount}
          icon="&#128194;"
          helper="Projects that are both active and publicly visible"
        />
        <SummaryCard
          label="Public Activity Records"
          value={stats.totalPublicActivityCount}
          icon="&#128221;"
          helper={`All-time public count: manual logs ${stats.publicManualLogCount} + synced external activities ${stats.publicExternalActivityCount}`}
        />
        <SummaryCard
          label="Featured Manual Logs"
          value={stats.highlightedLogCount}
          icon="&#11088;"
          helper="Only public manual logs marked as highlighted"
        />
      </section>

      {projects.content.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Portfolio
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                Active Public Projects
              </h2>
            </div>
            <p className="hidden max-w-md text-right text-sm leading-6 text-gray-500 md:block">
              Each card points to project-specific activity history and category
              context.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.content.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ActivityChart metrics={stats.activityTypeCounts} />
          <p className="mt-2 px-1 text-xs text-gray-400">
            Distribution is based on public manual logs. External synced
            activities are included in the total activity KPI above.
          </p>
        </div>
        <div className="lg:col-span-2">
          <RecentTimeline items={timeline.content} />
        </div>
      </section>
    </div>
  );
}
