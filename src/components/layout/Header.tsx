import Link from "next/link";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-gray-900">
          Dev Activity Hub
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
