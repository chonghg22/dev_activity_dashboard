interface SummaryCardProps {
  label: string;
  value: number;
  icon: string;
  helper?: string;
}

export default function SummaryCard({
  label,
  value,
  icon,
  helper,
}: SummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.07)] backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-amber-100/60 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              {label}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
              {value}
            </p>
          </div>
          <span className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xl shadow-sm">
            {icon}
          </span>
        </div>
        {helper ? (
          <p className="mt-4 max-w-[18rem] text-xs leading-5 text-gray-500">
            {helper}
          </p>
        ) : null}
      </div>
    </div>
  );
}
