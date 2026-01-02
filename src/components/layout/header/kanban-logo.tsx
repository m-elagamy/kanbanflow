import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban } from "lucide-react";

const KanbanLogo = () => {
  const pathName = usePathname();

  return (
    <div
      className={`${pathName === "/" ? "mx-0" : "mx-auto"} relative z-1 w-fit md:mx-0`}
    >
      <Link
        href="/"
        className="flex items-center gap-1"
        aria-label="Go to KanbanFlow homepage"
      >
        <Kanban className="text-primary/70 size-6 md:size-8" />

        <span
          className={`text-gradient text-xl font-bold tracking-tight md:text-2xl`}
        >
          KanbanFlow
        </span>
      </Link>
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="from-primary/10 via-primary/5 to-secondary/10 dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20 size-40 rounded-full bg-linear-to-tr blur-3xl" />
      </div>
    </div>
  );
};

export default KanbanLogo;
