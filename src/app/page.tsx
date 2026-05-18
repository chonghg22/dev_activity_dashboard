import {
  fetchRecentTimeline,
  fetchPublicProjects,
  fetchStatsSummary,
} from "@/lib/api";
import { formatDateTimeCompact } from "@/lib/format";
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
          API 서버에 연결할 수 없습니다.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          백엔드가 실행 중인지 확인해 주세요.
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
              공개 포트폴리오 스냅샷
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              프로젝트, 수기 로그, 동기화된 개발 활동을 한눈에 보는
              공개 타임라인
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              Dev Activity Hub는 공개 가능한 프로젝트 작업 기록을
              백엔드 중심 관점으로 정리합니다. 무엇을 만들었는지, 어디에
              시간이 쌓였는지, 어떤 기록을 강조할지 빠르게 확인할 수 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                수집 소스
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-950">2</p>
              <p className="mt-1 text-xs text-gray-500">
                수기 로그 + GitHub 동기화
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                공개 범위
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-950">
                {stats.publicProjectCount}
              </p>
              <p className="mt-1 text-xs text-gray-500">공개 중인 활성 프로젝트</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/70 px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
              집계 기준
            </p>
            <p className="mt-1 text-sm leading-6 text-amber-950/85">
              모든 KPI는 공개 프로젝트만 대상으로 집계합니다. 커밋과 PR은
              GitHub 동기화 활동 기준이며, PR 수는 현재 고유 PR 개수가 아닌
              PR 이벤트 수입니다.
            </p>
          </div>
          <span className="inline-flex rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-xs font-medium text-amber-800">
            공개 프로젝트 + GitHub 동기화 기준
          </span>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              핵심 지표
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
              누적 지표
            </h2>
          </div>
          <p className="hidden max-w-md text-right text-sm leading-6 text-gray-500 md:block">
            프로젝트 수와 누적 GitHub 활동량 중심으로 포트폴리오의 전체 규모를
            보여줍니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="공개 프로젝트"
            value={stats.publicProjectCount}
            icon="&#128194;"
            helper="활성 상태이면서 공개로 설정된 프로젝트 수"
          />
          <SummaryCard
            label="총 커밋 수"
            value={stats.totalCommitCount}
            icon="&#128221;"
            helper="모든 공개 프로젝트에 누적된 GitHub 커밋 활동 수"
          />
          <SummaryCard
            label="총 PR 이벤트 수"
            value={stats.totalPullRequestActivityCount}
            icon="&#128260;"
            helper="PR 생성, 머지, 종료 이벤트를 모두 합산한 누적 수"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              최근 흐름
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
              최근 활동 추세
            </h2>
          </div>
          <p className="hidden max-w-md text-right text-sm leading-6 text-gray-500 md:block">
            이번 주와 최근 7일 기준으로 현재 얼마나 활동이 이어지고 있는지
            보여줍니다.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="주간 커밋 수"
            value={stats.weeklyCommitCount}
            icon="&#128197;"
            helper="이번 주 월요일부터 집계한 공개 커밋 활동 수"
          />
          <SummaryCard
            label="주간 PR 이벤트 수"
            value={stats.weeklyPullRequestActivityCount}
            icon="&#128209;"
            helper="이번 주 월요일부터 집계한 PR 생성, 머지, 종료 이벤트 수"
          />
          <SummaryCard
            label="최근 동기화 시각"
            value={formatDateTimeCompact(stats.lastSyncedAt)}
            icon="&#9201;"
            helper="가장 최근에 GitHub 동기화가 완료된 시각"
          />
        </div>
      </section>

      {projects.content.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                포트폴리오
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                공개 프로젝트
              </h2>
            </div>
            <p className="hidden max-w-md text-right text-sm leading-6 text-gray-500 md:block">
              각 카드에서 프로젝트별 활동 이력과 카테고리 맥락을 확인할 수
              있습니다.
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
        </div>
        <div className="lg:col-span-2">
          <RecentTimeline items={timeline.content} />
        </div>
      </section>
    </div>
  );
}
