export const dynamic = "force-dynamic";

import Link from "next/link";
import SummaryCard from "@/components/dashboard/SummaryCard";
import { fetchWeeklyStats } from "@/lib/api";
import { activityTypeColor, activityTypeLabel, formatDate } from "@/lib/format";

interface Props {
  searchParams: Promise<{ week?: string }>;
}

function normalizeWeekStartDate(input?: string) {
  const today = new Date();

  if (!input) {
    return toWeekStart(today);
  }

  const parsed = new Date(`${input}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return toWeekStart(today);
  }

  return toWeekStart(parsed);
}

function toWeekStart(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  const day = normalized.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  normalized.setDate(normalized.getDate() + diff);

  return formatDate(normalized);
}

function shiftWeek(weekStartDate: string, offsetWeeks: number) {
  const base = new Date(`${weekStartDate}T00:00:00`);
  base.setDate(base.getDate() + offsetWeeks * 7);
  return formatDate(base);
}

function percentage(count: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function weekRangeLabel(start: string, end: string) {
  return `${start} - ${end}`;
}

export default async function WeeklyPage({ searchParams }: Props) {
  const params = await searchParams;
  const week = normalizeWeekStartDate(params.week);
  const stats = await fetchWeeklyStats(week);

  if (!stats) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-medium text-stone-500">
          주간 데이터를 불러올 수 없습니다.
        </p>
        <p className="mt-1 text-sm text-stone-500">
          데이터베이스 연결 상태를 확인한 뒤 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const previousWeek = shiftWeek(stats.weekStartDate, -1);
  const nextWeek = shiftWeek(stats.weekStartDate, 1);
  const currentWeek = normalizeWeekStartDate();
  const totalActivities = stats.totalActivities;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
              주간 리뷰
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
              {weekRangeLabel(stats.weekStartDate, stats.weekEndDate)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              선택한 주의 공개 수기 활동 로그 기준 요약입니다. 외부 동기화
              활동은 아직 이 화면에 포함되지 않습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/weekly?week=${previousWeek}`}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              이전 주
            </Link>
            <Link
              href={`/weekly?week=${currentWeek}`}
              className="rounded-lg border border-stone-900 bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              이번 주
            </Link>
            <Link
              href={`/weekly?week=${nextWeek}`}
              className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              다음 주
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="총 활동 수"
          value={stats.totalActivities}
          icon="Logs"
        />
        <SummaryCard
          label="하이라이트"
          value={stats.highlightedActivities}
          icon="Pick"
        />
        <SummaryCard
          label="활동 프로젝트"
          value={stats.projectCounts.length}
          icon="Focus"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-950">
              활동 유형
            </h2>
            <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
              {stats.activityTypeCounts.length}개 그룹
            </span>
          </div>

          {stats.activityTypeCounts.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-500">
              이번 주에 기록된 공개 수기 활동이 없습니다.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {stats.activityTypeCounts.map((metric) => {
                const pct = percentage(metric.count, totalActivities);
                return (
                  <div key={metric.activityType}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${activityTypeColor(metric.activityType)}`}
                      >
                        {activityTypeLabel(metric.activityType)}
                      </span>
                      <span className="text-stone-500">
                        {metric.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className="h-full rounded-full bg-stone-900 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-950">
              프로젝트 비중
            </h2>
            <span className="text-xs uppercase tracking-[0.16em] text-stone-500">
              주간 분포
            </span>
          </div>

          {stats.projectCounts.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-500">
              이번 주 프로젝트 활동이 없습니다.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {stats.projectCounts.map((metric, index) => {
                const pct = percentage(metric.count, totalActivities);
                return (
                  <div
                    key={metric.projectSlug}
                    className="rounded-xl border border-stone-200 bg-stone-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                          #{String(index + 1).padStart(2, "0")}
                        </p>
                        <Link
                          href={`/projects/${metric.projectSlug}`}
                          className="mt-1 block text-base font-semibold text-stone-950 hover:text-stone-700"
                        >
                          {metric.projectName}
                        </Link>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-stone-950">
                          {metric.count}
                        </p>
                        <p className="text-sm text-stone-500">{pct}%</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-stone-900 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
