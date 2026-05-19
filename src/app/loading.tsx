export default function Loading() {
  return (
    <div className="space-y-6" aria-label="페이지를 불러오는 중">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="h-3 w-24 rounded-full bg-stone-200" />
        <div className="mt-4 h-8 w-52 rounded-full bg-stone-200" />
        <div className="mt-4 max-w-2xl space-y-2">
          <div className="h-3 rounded-full bg-stone-100" />
          <div className="h-3 w-3/4 rounded-full bg-stone-100" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <div className="h-3 w-28 rounded-full bg-stone-100" />
            <div className="mt-4 h-6 w-36 rounded-full bg-stone-200" />
            <div className="mt-5 space-y-2">
              <div className="h-3 rounded-full bg-stone-100" />
              <div className="h-3 w-2/3 rounded-full bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
