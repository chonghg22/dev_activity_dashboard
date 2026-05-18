interface SummaryCardProps {
  label: string;
  value: number | string;
  icon: string;
  helper?: string;
}

export default function SummaryCard({
  label,
  value,
  icon,
  helper,
}: SummaryCardProps) {
  const isNumeric = typeof value === "number";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {label}
          </p>
          <p
            className={`mt-3 font-semibold tracking-tight text-stone-950 ${
              isNumeric ? "text-3xl" : "text-2xl"
            }`}
          >
            {value}
          </p>
        </div>
        <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-600">
          {icon}
        </span>
      </div>
      {helper ? (
        <p className="mt-4 max-w-[18rem] text-sm leading-6 text-stone-500">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
