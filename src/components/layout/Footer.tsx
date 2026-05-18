export default function Footer() {
  return (
    <footer className="border-t border-stone-200/80 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-stone-500 sm:px-6">
        <p>&copy; {new Date().getFullYear()} Dev Activity Hub</p>
      </div>
    </footer>
  );
}
