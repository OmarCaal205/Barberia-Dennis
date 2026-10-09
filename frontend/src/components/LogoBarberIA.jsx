export default function LogoBarberIA({ size = 84 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BarberIA"
    >
      <defs>
        <clipPath id="circulo-logo">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <pattern
          id="rayas-poste"
          width="26"
          height="26"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="26" height="26" fill="#f1eae0" />
          <rect width="9" height="26" fill="#8b2e2e" />
          <rect x="17" width="9" height="26" fill="#2f4858" />
        </pattern>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#1b1b1d" stroke="#b8912f" strokeWidth="2.5" />
      <g clipPath="url(#circulo-logo)">
        <rect x="10" y="34" width="80" height="32" fill="url(#rayas-poste)" />
      </g>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#1b1b1d" strokeWidth="10" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#b8912f" strokeWidth="1.5" />
    </svg>
  );
}