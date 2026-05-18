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

  const selectClass =
    "rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-700 focus:border-stone-500 focus:outline-none";
  const inputClass =
    "rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-700 focus:border-stone-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-stone-200 bg-white p-4"
    >
      <div className="min-w-[220px] flex-1 flex-col gap-1">
        <label className="text-xs font-medium text-stone-500">검색어</label>
        <input
          type="text"
          name="keyword"
          defaultValue={currentKeyword ?? ""}
          placeholder="제목 또는 내용 검색"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-500">프로젝트</label>
        <select
          name="projectSlug"
          defaultValue={currentProjectSlug ?? ""}
          className={selectClass}
        >
          <option value="">전체</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-500">활동 유형</label>
        <select
          name="activityType"
          defaultValue={currentActivityType ?? ""}
          className={selectClass}
        >
          <option value="">전체</option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {activityTypeLabel(t)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-500">시작일</label>
        <input
          type="date"
          name="from"
          defaultValue={currentFrom ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-stone-500">종료일</label>
        <input
          type="date"
          name="to"
          defaultValue={currentTo ?? ""}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
      >
        적용
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
      >
        초기화
      </button>
    </form>
  );
}
