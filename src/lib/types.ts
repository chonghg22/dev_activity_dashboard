// ── 공통 ──

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// ── Public Project ──

export interface PublicProjectListItem {
  name: string;
  slug: string;
  description: string | null;
  category: string;
}

export interface PublicProjectDetail {
  name: string;
  slug: string;
  description: string | null;
  category: string;
  startedOn: string | null;
  endedOn: string | null;
}

// ── Public Stats ──

export interface ActivityTypeMetric {
  activityType: string;
  count: number;
}

export interface ProjectMetric {
  projectSlug: string;
  projectName: string;
  count: number;
}

export interface PublicStatsSummary {
  publicProjectCount: number;
  publicManualLogCount: number;
  publicExternalActivityCount: number;
  totalPublicActivityCount: number;
  highlightedLogCount: number;
  activityTypeCounts: ActivityTypeMetric[];
}

export interface PublicWeeklyStats {
  weekStartDate: string;
  weekEndDate: string;
  totalActivities: number;
  highlightedActivities: number;
  activityTypeCounts: ActivityTypeMetric[];
  projectCounts: ProjectMetric[];
}

// ── Public Timeline ──

export interface PublicTimelineItem {
  id: number;
  sourceKind: "MANUAL_LOG" | "EXTERNAL_ACTIVITY";
  occurredAt: string;
  projectSlug: string;
  projectName: string;
  title: string;
  content: string;
  activityType: string;
  workDate: string;
  startedAt: string | null;
  endedAt: string | null;
  highlighted: boolean;
  tags: string[];
}

// ── Timeline 필터 파라미터 ──

export interface TimelineParams {
  keyword?: string;
  projectSlug?: string;
  activityType?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}
