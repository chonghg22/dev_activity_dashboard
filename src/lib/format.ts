/** 활동 유형을 사람이 읽기 좋은 라벨로 변환 */
export function activityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    CODING: "Coding",
    TESTING: "Testing",
    DOCUMENTATION: "Documentation",
    MEETING: "Meeting",
    CODE_REVIEW: "Code Review",
    DEBUGGING: "Debugging",
    OTHER: "Other",
    COMMIT: "Commit",
    ISSUE_OPENED: "Issue Opened",
    ISSUE_CLOSED: "Issue Closed",
    PR_OPENED: "PR Opened",
    PR_MERGED: "PR Merged",
    PR_CLOSED: "PR Closed",
  };
  return map[type] ?? type;
}

/** 활동 유형별 색상 클래스 */
export function activityTypeColor(type: string): string {
  const map: Record<string, string> = {
    CODING: "bg-blue-100 text-blue-800",
    TESTING: "bg-green-100 text-green-800",
    DOCUMENTATION: "bg-yellow-100 text-yellow-800",
    MEETING: "bg-purple-100 text-purple-800",
    CODE_REVIEW: "bg-pink-100 text-pink-800",
    DEBUGGING: "bg-red-100 text-red-800",
    COMMIT: "bg-emerald-100 text-emerald-800",
    ISSUE_OPENED: "bg-orange-100 text-orange-800",
    ISSUE_CLOSED: "bg-gray-100 text-gray-800",
    PR_OPENED: "bg-indigo-100 text-indigo-800",
    PR_MERGED: "bg-violet-100 text-violet-800",
    PR_CLOSED: "bg-slate-100 text-slate-800",
  };
  return map[type] ?? "bg-gray-100 text-gray-800";
}

/** ISO datetime → 'YYYY-MM-DD' */
export function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

/** ISO datetime → 'YYYY-MM-DD HH:mm' */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** sourceKind 라벨 */
export function sourceKindLabel(kind: string): string {
  return kind === "MANUAL_LOG" ? "Manual" : "External";
}
