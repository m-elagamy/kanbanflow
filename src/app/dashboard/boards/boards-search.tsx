"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BoardsSearchProps = {
  initialQuery: string;
};

export default function BoardsSearch({ initialQuery }: BoardsSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [urlQuery, setUrlQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  if (initialQuery !== urlQuery) {
    setUrlQuery(initialQuery);
    setQuery(initialQuery);
  }

  useEffect(() => {
    const normalizedQuery = query.trim();
    const currentQuery = searchParams.get("q") ?? "";
    if (normalizedQuery === currentQuery) return;

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (normalizedQuery) params.set("q", normalizedQuery);
      else params.delete("q");
      params.delete("page");

      const search = params.toString();
      startTransition(() => {
        router.replace(`${pathname}${search ? `?${search}` : ""}`, {
          scroll: false,
        });
      });
    }, 250);

    return () => clearTimeout(timeout);
  }, [pathname, query, router, searchParams]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="relative mb-6">
      <label htmlFor="boards-search" className="sr-only">
        Search boards
      </label>
      {isPending ? (
        <LoaderCircle
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
      )}
      <Input
        id="boards-search"
        type="search"
        value={query}
        maxLength={100}
        placeholder="Search boards by name or description"
        className="pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
        aria-busy={isPending}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
          aria-label="Clear board search"
          onClick={clearSearch}
        >
          <X aria-hidden="true" />
        </Button>
      )}
      <span className="sr-only" aria-live="polite">
        {isPending ? "Searching boards" : "Board search updated"}
      </span>
    </div>
  );
}
