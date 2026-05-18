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
    <nav className="flex flex-wrap justify-end gap-2">
      {NAV_ITEMS.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-3.5 py-2 text-sm font-medium ${
              active
                ? "border border-stone-900 bg-stone-900 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
