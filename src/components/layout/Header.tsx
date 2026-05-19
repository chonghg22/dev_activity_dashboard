import Link from "next/link";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-4 sm:h-18 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-0">
        <Link href="/" className="min-w-0 shrink-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            Portfolio Dashboard
          </span>
          <span className="mt-1 block text-lg font-semibold tracking-tight text-stone-950">
            Dev Activity Hub
          </span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
