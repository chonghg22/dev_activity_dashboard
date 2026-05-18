import Link from "next/link";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="min-w-0">
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
