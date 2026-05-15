/** 활동 유형을 사람이 읽기 좋은 라벨로 변환 */
export function activityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    CODING: "개발",
    TESTING: "테스트",
    DOCUMENTATION: "문서화",
    MEETING: "회의",
    CODE_REVIEW: "코드 리뷰",
    DEBUGGING: "디버깅",
    OTHER: "기타",
    COMMIT: "커밋",
    ISSUE_OPENED: "이슈 등록",
    ISSUE_CLOSED: "이슈 종료",
    PR_OPENED: "PR 생성",
    PR_MERGED: "PR 머지",
    PR_CLOSED: "PR 종료",
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

/** date/datetime 값 → 'YYYY-MM-DD' */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

/** ISO datetime → 'YYYY-MM-DD HH:mm' */
export function formatDateTime(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** sourceKind 라벨 */
export function sourceKindLabel(kind: string): string {
  return kind === "MANUAL_LOG" ? "수기 로그" : "외부 활동";
}
