export default function Card({ title, description, right, children, className = "" }) {
  return (
    <section
      className={[
        "rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur",
        "dark:border-slate-800 dark:bg-slate-950/40",
        className,
      ].join(" ")}
    >
      {(title || description || right) && (
        <header className="flex flex-col gap-2 border-b border-slate-200/60 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

