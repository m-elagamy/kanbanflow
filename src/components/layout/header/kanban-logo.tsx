import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban } from "lucide-react";

const KanbanLogo = () => {
  const pathName = usePathname();

  return (
    <div
      className={`${pathName === "/" ? "mx-0" : "mx-auto"} relative z-[1] md:mx-0`}
    >
      <Link
        href="/"
        className="flex items-center gap-1"
        aria-label="Go to KanbanFlow homepage"
      >
        <Kanban className="size-6 text-primary/70 md:size-8" />

        <span
          className={`text-gradient text-xl font-bold tracking-tight md:text-2xl`}
        >
          KanbanFlow
        </span>
      </Link>
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="size-40 rounded-full bg-gradient-to-tr from-primary/10 via-primary/5 to-secondary/10 blur-3xl dark:from-primary/20 dark:via-primary/10 dark:to-secondary/20" />
      </div>
    </div>
  );
};

export default KanbanLogo;
