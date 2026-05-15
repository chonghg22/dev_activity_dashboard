"use client";

import { useRouter } from "next/navigation";
import { useCallback, type FormEvent } from "react";
import type { PublicProjectListItem } from "@/lib/types";

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
    "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none";
  const inputClass =
    "rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-gray-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="min-w-[220px] flex-1 flex-col gap-1">
        <label className="text-xs text-gray-500">Keyword</label>
        <input
          type="text"
          name="keyword"
          defaultValue={currentKeyword ?? ""}
          placeholder="Search title or content"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Project</label>
        <select
          name="projectSlug"
          defaultValue={currentProjectSlug ?? ""}
          className={selectClass}
        >
          <option value="">All</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Activity Type</label>
        <select
          name="activityType"
          defaultValue={currentActivityType ?? ""}
          className={selectClass}
        >
          <option value="">All</option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">From</label>
        <input
          type="date"
          name="from"
          defaultValue={currentFrom ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">To</label>
        <input
          type="date"
          name="to"
          defaultValue={currentTo ?? ""}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Filter
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        Reset
      </button>
    </form>
  );
}
