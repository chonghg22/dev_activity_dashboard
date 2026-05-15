import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const sp = new URLSearchParams(extraParams);
    sp.set("page", String(page));
    return `${basePath}?${sp.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {currentPage > 0 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          이전
        </Link>
      )}
      <span className="text-sm text-gray-500">
        {currentPage + 1} / {totalPages}
      </span>
      {currentPage < totalPages - 1 && (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          다음
        </Link>
      )}
    </div>
  );
}
