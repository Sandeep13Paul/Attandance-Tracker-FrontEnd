export default function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
  className = "",
}) {
  const tones = {
    neutral:
      "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-900/40 dark:text-slate-200 dark:ring-slate-800",
    success:
      "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-900/60",
    danger:
      "bg-rose-50 text-rose-800 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-900/60",
    info:
      "bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-100 dark:ring-indigo-900/60",
    warning:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-900/60",
  };

  return (
    <div
      className={`
        rounded-2xl p-5 ring-1
        h-full min-h-[140px]
        flex flex-col justify-between
        ${tones[tone]}
        ${className}
      `}
    >
      {/* 🔹 LABEL */}
      <div className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </div>

      {/* 🔹 VALUE */}
      <div className="mt-2 text-4xl font-bold tracking-tight">
        {value}
      </div>

      {/* 🔹 HINT */}
      {hint && (
        <div className="text-sm opacity-70">
          {hint}
        </div>
      )}
    </div>
  );
}