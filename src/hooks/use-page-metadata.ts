"use client";

import { useEffect } from "react";

const usePageMetadata = (title: string, description: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    const existingMeta = document.querySelector('meta[name="description"]');
    const previousDescription = existingMeta?.getAttribute("content") ?? null;
    const createdMeta = !existingMeta;

    document.title = title;

    if (existingMeta) {
      existingMeta.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    return () => {
      document.title = previousTitle;

      const meta = document.querySelector('meta[name="description"]');
      if (!meta) return;

      if (createdMeta) {
        meta.remove();
      } else if (previousDescription !== null) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
};

export default usePageMetadata;
