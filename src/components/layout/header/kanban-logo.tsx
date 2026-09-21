import Link from "next/link";
import { usePathname } from "next/navigation";

const KanbanLogo = () => {
  const pathName = usePathname();

  return (
    <div
      className={`${pathName === "/" ? "mx-0" : "mx-auto"} relative z-1 w-fit md:mx-0`}
    >
      <Link
        href="/"
        className="flex items-center gap-1"
        aria-label="Go to Kanbamy homepage"
      >
        <span
          aria-hidden="true"
          className="size-9.5 shrink-0 bg-primary"
          style={{
            WebkitMaskImage: "url('/brand/kanbamy.png')",
            maskImage: "url('/brand/kanbamy.png')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskSize: "contain",
            maskSize: "contain",
          }}
        />

        <span className="text-gradient text-xl font-bold tracking-tight md:text-2xl">
          Kanbamy
        </span>
      </Link>

      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 size-40 rounded-full bg-linear-to-tr blur-3xl" />
      </div>
    </div>
  );
};

export default KanbanLogo;