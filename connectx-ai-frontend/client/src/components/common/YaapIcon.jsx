export default function YaapIcon({ size = 24, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="yaap-icon-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      
      {/* Simplified Y shape */}
      <path 
        d="M 6 4 L 12 14 L 12 20 M 18 4 L 12 14" 
        stroke="url(#yaap-icon-gradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Dot */}
      <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
      
      {/* Small exclamation accents */}
      <line x1="20" y1="5" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="21.5" y1="7" x2="21.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}
