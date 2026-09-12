export default function EmptyBoardsIllustration() {
  return (
    <svg
      viewBox="0 0 112 80"
      className="h-20 w-28"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="56"
        cy="70"
        rx="42"
        ry="6"
        className="fill-muted-foreground/10"
      />
      <rect
        x="13"
        y="8"
        width="86"
        height="55"
        rx="7"
        className="fill-background stroke-border"
        strokeWidth="1.5"
      />
      <path d="M13 19.5h86" className="stroke-border" strokeWidth="1.5" />
      <circle cx="21" cy="14" r="1.5" className="fill-muted-foreground/25" />
      <circle cx="26" cy="14" r="1.5" className="fill-muted-foreground/20" />
      <rect
        x="20"
        y="27"
        width="20"
        height="27"
        rx="3"
        className="fill-muted/70 stroke-border"
        strokeWidth="1.25"
      />
      <rect
        x="46"
        y="27"
        width="20"
        height="27"
        rx="3"
        className="fill-muted/50 stroke-border"
        strokeWidth="1.25"
      />
      <rect
        x="72"
        y="27"
        width="20"
        height="27"
        rx="3"
        className="fill-muted/30 stroke-border"
        strokeWidth="1.25"
      />
      <path
        d="M25 33h10M51 33h10M77 33h10"
        className="stroke-muted-foreground/30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
