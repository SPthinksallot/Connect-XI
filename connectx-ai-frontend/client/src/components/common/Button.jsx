const VARIANTS = {
  primary:
    "bg-violet-500 text-white hover:bg-violet-600 disabled:bg-violet-500/50",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100 dark:text-paper-100 dark:hover:bg-ink-800",
  subtle:
    "bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-paper-100 dark:hover:bg-ink-700",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
