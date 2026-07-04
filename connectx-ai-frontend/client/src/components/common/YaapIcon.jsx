export default function YaapIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Yaap"
    >
      <defs>
        <linearGradient id="yaap-bolt-g" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Lightning bolt — the Yaap brand spark */}
      <path
        d="M14.5 3L6 13.5H11.5L9.5 21L18 10.5H12.5L14.5 3Z"
        fill="url(#yaap-bolt-g)"
        stroke="none"
      />
    </svg>
  );
}
