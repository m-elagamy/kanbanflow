export default function EmptyResultsIllustration() {
  return (
    <svg
      viewBox="0 0 72 52"
      className="h-13 w-18"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="34"
        cy="45"
        rx="25"
        ry="4"
        className="fill-muted-foreground/10"
      />
      <rect
        x="12"
        y="7"
        width="39"
        height="35"
        rx="5"
        className="fill-background stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="M20 16h21M20 22h16M20 28h11"
        className="stroke-muted-foreground/25"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="49"
        cy="32"
        r="9"
        className="fill-muted/80 stroke-border"
        strokeWidth="1.5"
      />
      <path
        d="m55.5 38.5 5 5"
        className="stroke-muted-foreground/50"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
