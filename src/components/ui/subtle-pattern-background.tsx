export default function SubtlePatternBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-5">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <pattern
          id="subtle-pattern"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#subtle-pattern)" />
      </svg>
    </div>
  );
}
