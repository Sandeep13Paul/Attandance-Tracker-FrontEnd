export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-950";

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    danger:
      "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-300 dark:bg-rose-600 dark:hover:bg-rose-500",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-500",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-200 dark:hover:bg-slate-900",
  };

  return (
    <button
      type="button"
      className={[base, sizes[size], variants[variant], className].join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

