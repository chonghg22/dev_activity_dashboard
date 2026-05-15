import type {
  PageResponse,
  PublicProjectListItem,
  PublicProjectDetail,
  PublicStatsSummary,
  PublicWeeklyStats,
  PublicTimelineItem,
  TimelineParams,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText} – ${path}`);
  }
  return res.json() as Promise<T>;
}

async function fetchJsonOrNull<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    return await fetchJson<T>(path, init);
  } catch {
    return null;
  }
}

// ── Public Stats ──

export function fetchStatsSummary() {
  return fetchJsonOrNull<PublicStatsSummary>("/api/public/stats/summary", {
    next: { revalidate: 300 },
  });
}

export function fetchWeeklyStats(weekStartDate?: string) {
  const qs = weekStartDate ? `?weekStartDate=${weekStartDate}` : "";
  return fetchJsonOrNull<PublicWeeklyStats>(`/api/public/stats/weekly${qs}`, {
    next: { revalidate: 300 },
  });
}

// ── Public Projects ──

const EMPTY_PAGE: PageResponse<never> = {
  content: [],
  page: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
};

export async function fetchPublicProjects(page = 0, size = 20) {
  return (
    (await fetchJsonOrNull<PageResponse<PublicProjectListItem>>(
      `/api/public/projects?page=${page}&size=${size}`,
      { next: { revalidate: 300 } },
    )) ?? (EMPTY_PAGE as PageResponse<PublicProjectListItem>)
  );
}

export function fetchProjectDetail(slug: string) {
  return fetchJson<PublicProjectDetail>(`/api/public/projects/${slug}`, {
    next: { revalidate: 300 },
  });
}

// ── Public Timeline ──

export async function fetchTimeline(params: TimelineParams = {}) {
  const sp = new URLSearchParams();
  if (params.projectSlug) sp.set("projectSlug", params.projectSlug);
  if (params.activityType) sp.set("activityType", params.activityType);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  sp.set("page", String(params.page ?? 0));
  sp.set("size", String(params.size ?? 20));

  return (
    (await fetchJsonOrNull<PageResponse<PublicTimelineItem>>(
      `/api/public/timeline?${sp.toString()}`,
      { next: { revalidate: 60 } },
    )) ?? (EMPTY_PAGE as PageResponse<PublicTimelineItem>)
  );
}
