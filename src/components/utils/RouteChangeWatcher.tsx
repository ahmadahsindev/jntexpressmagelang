"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export function RouteChangeWatcher({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handlePopState = () => {
      // Force refresh data on back/forward buttons
      router.refresh();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return <>{children}</>;
}
