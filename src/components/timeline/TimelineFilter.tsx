"use client";

import { useRouter } from "next/navigation";
import { useCallback, type FormEvent } from "react";
import type { PublicProjectListItem } from "@/lib/types";
import { activityTypeLabel } from "@/lib/format";

const ACTIVITY_TYPES = [
  "CODING",
  "TESTING",
  "DOCUMENTATION",
  "MEETING",
  "CODE_REVIEW",
  "DEBUGGING",
  "OTHER",
  "COMMIT",
  "ISSUE_OPENED",
  "ISSUE_CLOSED",
  "PR_OPENED",
  "PR_MERGED",
  "PR_CLOSED",
];

interface TimelineFilterProps {
  projects: PublicProjectListItem[];
  currentKeyword?: string;
  currentProjectSlug?: string;
  currentActivityType?: string;
  currentFrom?: string;
  currentTo?: string;
}

export default function TimelineFilter({
  projects,
  currentKeyword,
  currentProjectSlug,
  currentActivityType,
  currentFrom,
  currentTo,
}: TimelineFilterProps) {
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const sp = new URLSearchParams();
      const keyword = fd.get("keyword") as string;
      const slug = fd.get("projectSlug") as string;
      const type = fd.get("activityType") as string;
      const from = fd.get("from") as string;
      const to = fd.get("to") as string;
      if (keyword.trim()) sp.set("keyword", keyword.trim());
      if (slug) sp.set("projectSlug", slug);
      if (type) sp.set("activityType", type);
      if (from) sp.set("from", from);
      if (to) sp.set("to", to);
      router.push(`/timeline?${sp.toString()}`);
    },
    [router],
  );

  const handleReset = useCallback(() => {
    router.push("/timeline");
  }, [router]);

  const controlClass =
    "h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 text-sm text-stone-800 shadow-sm shadow-stone-950/[0.02] focus:border-stone-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-stone-200/70";
  const labelClass =
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm shadow-stone-950/[0.03] sm:p-5"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_minmax(140px,0.8fr)_minmax(150px,0.9fr)_minmax(150px,0.9fr)_auto] lg:items-end">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>검색어</label>
          <input
            type="text"
            name="keyword"
            defaultValue={currentKeyword ?? ""}
            placeholder="제목 또는 내용 검색"
            className={controlClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>프로젝트</label>
          <select
            name="projectSlug"
            defaultValue={currentProjectSlug ?? ""}
            className={controlClass}
          >
            <option value="">전체</option>
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>활동 유형</label>
          <select
            name="activityType"
            defaultValue={currentActivityType ?? ""}
            className={controlClass}
          >
            <option value="">전체</option>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>
                {activityTypeLabel(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>시작일</label>
          <input
            type="date"
            name="from"
            defaultValue={currentFrom ?? ""}
            className={controlClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>종료일</label>
          <input
            type="date"
            name="to"
            defaultValue={currentTo ?? ""}
            className={controlClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 lg:flex lg:w-max">
          <button
            type="submit"
            className="h-12 rounded-xl bg-stone-950 px-5 text-sm font-semibold text-white shadow-sm shadow-stone-950/15 hover:bg-stone-800"
          >
            적용
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="h-12 rounded-xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-600 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-900"
          >
            초기화
          </button>
        </div>
      </div>
    </form>
  );
}
