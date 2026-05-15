"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "대시보드" },
  { href: "/projects", label: "프로젝트" },
  { href: "/timeline", label: "타임라인" },
  { href: "/weekly", label: "주간 리뷰" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1">
      {NAV_ITEMS.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
