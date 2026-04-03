"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <SidebarProvider>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-low space-y-6 flex-1 w-full">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-on-surface-variant text-sm font-medium animate-pulse uppercase tracking-[0.2em]">Memuat Data...</p>
          </div>
        </div>
      ) : (
        <>
          <AppSidebar />
          <SidebarInset className="bg-surface-container-low flex flex-col min-h-screen w-full min-w-0 overflow-hidden">
            <header className="flex sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md h-16 shrink-0 items-center gap-2 border-b border-border px-4 z-10 w-full font-headline">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex-1 min-w-0">
                 <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block md:hidden truncate">Admin Dashboard</span>
              </div>
            </header>
            <div className="flex-1 overflow-x-hidden w-full">
              {children}
            </div>
          </SidebarInset>
        </>
      )}
    </SidebarProvider>
  );
}
