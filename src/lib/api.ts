import "server-only";

import { unstable_cache } from "next/cache";
import { dbSchema, query } from "./db";
import type {
  PageResponse,
  PublicProjectListItem,
  PublicProjectDetail,
  PublicStatsSummary,
  PublicWeeklyStats,
  PublicTimelineItem,
  TimelineParams,
} from "./types";

// ── Public Stats ──

export async function fetchStatsSummary() {
  try {
    return await fetchCachedStatsSummary();
  } catch {
    return null;
  }
}

export async function fetchWeeklyStats(weekStartDate?: string) {
  try {
    return await fetchCachedWeeklyStats(weekStartDate ?? "");
  } catch {
    return null;
  }
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
  try {
    return await fetchCachedPublicProjects(page, size);
  } catch {
    return EMPTY_PAGE as PageResponse<PublicProjectListItem>;
  }
}

export async function fetchProjectDetail(slug: string) {
  try {
    return await fetchCachedProjectDetail(slug);
  } catch {
    return null;
  }
}

// ── Public Timeline ──

export async function fetchTimeline(params: TimelineParams = {}) {
  try {
    return await loadTimeline(params);
  } catch {
    return EMPTY_PAGE as PageResponse<PublicTimelineItem>;
  }
}

export async function fetchRecentTimeline() {
  try {
    return await fetchCachedRecentTimeline();
  } catch {
    return EMPTY_PAGE as PageResponse<PublicTimelineItem>;
  }
}

const fetchCachedStatsSummary = unstable_cache(
  loadStatsSummary,
  ["public-stats-summary"],
  { revalidate: 300 },
);

const fetchCachedWeeklyStats = unstable_cache(
  async (weekStartDate: string) => loadWeeklyStats(weekStartDate || undefined),
  ["public-weekly-stats"],
  { revalidate: 300 },
);

const fetchCachedPublicProjects = unstable_cache(
  loadPublicProjects,
  ["public-projects"],
  { revalidate: 300 },
);

const fetchCachedProjectDetail = unstable_cache(
  loadProjectDetail,
  ["public-project-detail"],
  { revalidate: 300 },
);

const fetchCachedRecentTimeline = unstable_cache(
  async () => loadTimeline({ page: 0, size: 10 }),
  ["public-recent-timeline"],
  { revalidate: 60 },
);

async function loadStatsSummary(): Promise<PublicStatsSummary> {
  const [
    publicProjectCountResult,
    publicManualLogCountResult,
    highlightedLogCountResult,
    activityTypeCountsResult,
  ] = await Promise.all([
    query<{ count: string }>(`
      SELECT COUNT(*)::text AS count
      FROM ${dbSchema}.projects p
      WHERE p.is_public = true
        AND p.status = 'ACTIVE'
    `),
    query<{ count: string }>(`
      SELECT COUNT(*)::text AS count
      FROM ${dbSchema}.manual_logs ml
      JOIN ${dbSchema}.projects p ON p.id = ml.project_id
      WHERE ml.visibility = 'PUBLIC'
        AND p.is_public = true
        AND p.status = 'ACTIVE'
    `),
    query<{ count: string }>(`
      SELECT COUNT(*)::text AS count
      FROM ${dbSchema}.manual_logs ml
      JOIN ${dbSchema}.projects p ON p.id = ml.project_id
      WHERE ml.visibility = 'PUBLIC'
        AND ml.is_highlighted = true
        AND p.is_public = true
        AND p.status = 'ACTIVE'
    `),
    query<{ activity_type: string; count: string }>(`
      SELECT ml.activity_type, COUNT(*)::text AS count
      FROM ${dbSchema}.manual_logs ml
      JOIN ${dbSchema}.projects p ON p.id = ml.project_id
      WHERE ml.visibility = 'PUBLIC'
        AND p.is_public = true
        AND p.status = 'ACTIVE'
      GROUP BY ml.activity_type
      ORDER BY COUNT(*) DESC, ml.activity_type ASC
    `),
  ]);

  return {
    publicProjectCount: Number(publicProjectCountResult.rows[0]?.count ?? 0),
    publicManualLogCount: Number(publicManualLogCountResult.rows[0]?.count ?? 0),
    highlightedLogCount: Number(highlightedLogCountResult.rows[0]?.count ?? 0),
    activityTypeCounts: activityTypeCountsResult.rows.map((row) => ({
      activityType: row.activity_type,
      count: Number(row.count),
    })),
  };
}

async function loadWeeklyStats(
  requestedWeekStartDate?: string,
): Promise<PublicWeeklyStats> {
  const weekStartDate = normalizeWeekStartDate(requestedWeekStartDate);
  const weekEndDate = addDays(weekStartDate, 6);

  const [
    totalActivitiesResult,
    highlightedActivitiesResult,
    activityTypeCountsResult,
    projectCountsResult,
  ] = await Promise.all([
    query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM ${dbSchema}.manual_logs ml
        JOIN ${dbSchema}.projects p ON p.id = ml.project_id
        WHERE ml.visibility = 'PUBLIC'
          AND p.is_public = true
          AND p.status = 'ACTIVE'
          AND ml.work_date BETWEEN $1::date AND $2::date
      `,
      [weekStartDate, weekEndDate],
    ),
    query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM ${dbSchema}.manual_logs ml
        JOIN ${dbSchema}.projects p ON p.id = ml.project_id
        WHERE ml.visibility = 'PUBLIC'
          AND ml.is_highlighted = true
          AND p.is_public = true
          AND p.status = 'ACTIVE'
          AND ml.work_date BETWEEN $1::date AND $2::date
      `,
      [weekStartDate, weekEndDate],
    ),
    query<{ activity_type: string; count: string }>(
      `
        SELECT ml.activity_type, COUNT(*)::text AS count
        FROM ${dbSchema}.manual_logs ml
        JOIN ${dbSchema}.projects p ON p.id = ml.project_id
        WHERE ml.visibility = 'PUBLIC'
          AND p.is_public = true
          AND p.status = 'ACTIVE'
          AND ml.work_date BETWEEN $1::date AND $2::date
        GROUP BY ml.activity_type
        ORDER BY COUNT(*) DESC, ml.activity_type ASC
      `,
      [weekStartDate, weekEndDate],
    ),
    query<{ project_slug: string; project_name: string; count: string }>(
      `
        SELECT p.slug AS project_slug, p.name AS project_name, COUNT(*)::text AS count
        FROM ${dbSchema}.manual_logs ml
        JOIN ${dbSchema}.projects p ON p.id = ml.project_id
        WHERE ml.visibility = 'PUBLIC'
          AND p.is_public = true
          AND p.status = 'ACTIVE'
          AND ml.work_date BETWEEN $1::date AND $2::date
        GROUP BY p.slug, p.name
        ORDER BY COUNT(*) DESC, p.name ASC
      `,
      [weekStartDate, weekEndDate],
    ),
  ]);

  return {
    weekStartDate,
    weekEndDate,
    totalActivities: Number(totalActivitiesResult.rows[0]?.count ?? 0),
    highlightedActivities: Number(
      highlightedActivitiesResult.rows[0]?.count ?? 0,
    ),
    activityTypeCounts: activityTypeCountsResult.rows.map((row) => ({
      activityType: row.activity_type,
      count: Number(row.count),
    })),
    projectCounts: projectCountsResult.rows.map((row) => ({
      projectSlug: row.project_slug,
      projectName: row.project_name,
      count: Number(row.count),
    })),
  };
}

async function loadPublicProjects(
  page = 0,
  size = 20,
): Promise<PageResponse<PublicProjectListItem>> {
  const offset = page * size;
  const [countResult, contentResult] = await Promise.all([
    query<{ count: string }>(`
      SELECT COUNT(*)::text AS count
      FROM ${dbSchema}.projects p
      WHERE p.is_public = true
        AND p.status = 'ACTIVE'
    `),
    query<{
      name: string;
      slug: string;
      description: string | null;
      category: string;
    }>(
      `
        SELECT p.name, p.slug, p.description, p.category
        FROM ${dbSchema}.projects p
        WHERE p.is_public = true
          AND p.status = 'ACTIVE'
        ORDER BY p.updated_at DESC
        LIMIT $1 OFFSET $2
      `,
      [size, offset],
    ),
  ]);

  return toPageResponse(
    contentResult.rows.map((row) => ({
      name: row.name,
      slug: row.slug,
      description: row.description,
      category: row.category,
    })),
    page,
    size,
    Number(countResult.rows[0]?.count ?? 0),
  );
}

async function loadProjectDetail(
  slug: string,
): Promise<PublicProjectDetail | null> {
  const result = await query<{
    name: string;
    slug: string;
    description: string | null;
    category: string;
    started_on: string | null;
    ended_on: string | null;
  }>(
    `
      SELECT p.name, p.slug, p.description, p.category, p.started_on, p.ended_on
      FROM ${dbSchema}.projects p
      WHERE p.slug = $1
        AND p.is_public = true
        AND p.status = 'ACTIVE'
      LIMIT 1
    `,
    [slug],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category,
    startedOn: row.started_on,
    endedOn: row.ended_on,
  };
}

async function loadTimeline(
  params: TimelineParams = {},
): Promise<PageResponse<PublicTimelineItem>> {
  const page = Math.max(0, params.page ?? 0);
  const size = Math.max(1, params.size ?? 20);
  const offset = page * size;
  const filters = buildTimelineFilters(params);

  const contentSql = `
    SELECT *
    FROM (
      SELECT
        ml.id,
        'MANUAL_LOG' AS source_kind,
        COALESCE(ml.ended_at, ml.started_at, ml.created_at) AS occurred_at,
        p.slug AS project_slug,
        p.name AS project_name,
        ml.title,
        ml.content,
        ml.activity_type,
        ml.work_date,
        ml.started_at,
        ml.ended_at,
        ml.is_highlighted AS highlighted,
        COALESCE((
          SELECT array_agg(t.name ORDER BY t.name)
          FROM ${dbSchema}.manual_log_tags mlt
          JOIN ${dbSchema}.tags t ON t.id = mlt.tag_id
          WHERE mlt.manual_log_id = ml.id
        ), ARRAY[]::text[]) AS tags
      FROM ${dbSchema}.manual_logs ml
      JOIN ${dbSchema}.projects p ON p.id = ml.project_id
      WHERE ml.visibility = 'PUBLIC'
        AND p.is_public = true
        AND p.status = 'ACTIVE'
        ${filters.manualWhere}

      UNION ALL

      SELECT
        ea.id,
        'EXTERNAL_ACTIVITY' AS source_kind,
        ea.occurred_at,
        p.slug AS project_slug,
        p.name AS project_name,
        ea.title,
        COALESCE(ea.content_summary, '') AS content,
        ea.activity_type,
        CAST(ea.occurred_at AS date) AS work_date,
        ea.occurred_at AS started_at,
        ea.occurred_at AS ended_at,
        false AS highlighted,
        ARRAY[]::text[] AS tags
      FROM ${dbSchema}.external_activities ea
      JOIN ${dbSchema}.projects p ON p.id = ea.project_id
      WHERE ea.is_public = true
        AND p.is_public = true
        AND p.status = 'ACTIVE'
        ${filters.externalWhere}
    ) timeline
    ORDER BY occurred_at DESC NULLS LAST, id DESC
    LIMIT $${filters.params.length + 1} OFFSET $${filters.params.length + 2}
  `;

  const countSql = `
    SELECT COUNT(*)::text AS count
    FROM (
      SELECT ml.id
      FROM ${dbSchema}.manual_logs ml
      JOIN ${dbSchema}.projects p ON p.id = ml.project_id
      WHERE ml.visibility = 'PUBLIC'
        AND p.is_public = true
        AND p.status = 'ACTIVE'
        ${filters.manualWhere}

      UNION ALL

      SELECT ea.id
      FROM ${dbSchema}.external_activities ea
      JOIN ${dbSchema}.projects p ON p.id = ea.project_id
      WHERE ea.is_public = true
        AND p.is_public = true
        AND p.status = 'ACTIVE'
        ${filters.externalWhere}
    ) timeline_count
  `;

  const [countResult, contentResult] = await Promise.all([
    query<{ count: string }>(countSql, filters.params),
    query<{
      id: string | number;
      source_kind: "MANUAL_LOG" | "EXTERNAL_ACTIVITY";
      occurred_at: Date | string;
      project_slug: string;
      project_name: string;
      title: string;
      content: string | null;
      activity_type: string;
      work_date: string;
      started_at: Date | string | null;
      ended_at: Date | string | null;
      highlighted: boolean;
      tags: string[] | null;
    }>(contentSql, [...filters.params, size, offset]),
  ]);

  const content = contentResult.rows.map((row) => ({
    id: Number(row.id),
    sourceKind: row.source_kind,
    occurredAt: toRequiredIsoString(row.occurred_at),
    projectSlug: row.project_slug,
    projectName: row.project_name,
    title: row.title,
    content: row.content ?? "",
    activityType: row.activity_type,
    workDate: row.work_date,
    startedAt: toIsoString(row.started_at),
    endedAt: toIsoString(row.ended_at),
    highlighted: row.highlighted,
    tags: row.tags ?? [],
  }));

  return toPageResponse(
    content,
    page,
    size,
    Number(countResult.rows[0]?.count ?? 0),
  );
}

function buildTimelineFilters(params: TimelineParams) {
  const manualClauses: string[] = [];
  const externalClauses: string[] = [];
  const values: unknown[] = [];

  if (params.projectSlug) {
    values.push(params.projectSlug);
    const placeholder = `$${values.length}`;
    manualClauses.push(`p.slug = ${placeholder}`);
    externalClauses.push(`p.slug = ${placeholder}`);
  }

  if (params.activityType) {
    values.push(params.activityType);
    const placeholder = `$${values.length}`;
    manualClauses.push(`ml.activity_type = ${placeholder}`);
    externalClauses.push(`ea.activity_type = ${placeholder}`);
  }

  if (params.from) {
    values.push(params.from);
    const placeholder = `$${values.length}`;
    manualClauses.push(`ml.work_date >= ${placeholder}::date`);
    externalClauses.push(`ea.occurred_at >= ${placeholder}::timestamptz`);
  }

  if (params.to) {
    values.push(params.to);
    const datePlaceholder = `$${values.length}`;
    manualClauses.push(`ml.work_date <= ${datePlaceholder}::date`);

    values.push(`${params.to}T23:59:59.999Z`);
    const timestampPlaceholder = `$${values.length}`;
    externalClauses.push(`ea.occurred_at <= ${timestampPlaceholder}::timestamptz`);
  }

  return {
    manualWhere:
      manualClauses.length > 0 ? ` AND ${manualClauses.join(" AND ")}` : "",
    externalWhere:
      externalClauses.length > 0
        ? ` AND ${externalClauses.join(" AND ")}`
        : "",
    params: values,
  };
}

function toPageResponse<T>(
  content: T[],
  page: number,
  size: number,
  totalElements: number,
): PageResponse<T> {
  const totalPages = totalElements === 0 ? 0 : Math.ceil(totalElements / size);
  return {
    content,
    page,
    size,
    totalElements,
    totalPages,
    first: page === 0,
    last: totalPages === 0 || page >= totalPages - 1,
  };
}

function normalizeWeekStartDate(requestedWeekStartDate?: string) {
  const baseDate = requestedWeekStartDate
    ? new Date(`${requestedWeekStartDate}T00:00:00Z`)
    : new Date();

  const utcDay = baseDate.getUTCDay();
  const diff = utcDay === 0 ? -6 : 1 - utcDay;
  baseDate.setUTCDate(baseDate.getUTCDate() + diff);
  return baseDate.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function toIsoString(value: Date | string | null) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function toRequiredIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}
