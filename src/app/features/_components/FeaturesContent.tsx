"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicHero } from "@/components/layout/PublicHero";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface FeaturesContent {
  content?: string;
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export default function FeaturesClientContent() {
  const [data, setData] = useState<FeaturesContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, "content", "features"));
        if (snap.exists()) {
          setData(snap.data() as FeaturesContent);
        }
      } catch (err) {
        console.error("Failed to fetch features content", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <div className="pt-20 md:pt-28 pb-16 min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!data) {
    return (
      <PublicLayout>
        <div className="pt-20 md:pt-28 pb-16 min-h-[50vh] flex items-center justify-center">
            <p className="text-on-surface-variant italic">Konten sedang diperbarui.</p>
        </div>
      </PublicLayout>
    );
  }

  const hasContent = data.content && data.content !== "<p></p>";

  return (
    <PublicLayout>
      {/* Hero Banner Section (Full Width) via Shared Component */}
      <PublicHero 
        bannerUrl={data.bannerUrl}
        bannerTitle={data.bannerTitle}
        bannerSubtitle={data.bannerSubtitle}
        fallbackTitle="Keunggulan Kami"
      />

      {/* Main Content Area */}
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {!hasContent ? (
            <div className="text-center py-20 text-on-surface-variant italic">
              Konten sedang diperbarui.
            </div>
          ) : (
            <div className="grid gap-12 max-w-4xl mx-auto relative z-20">
               <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-border shadow-sm">
                 <div 
                   className="prose prose-slate dark:prose-invert max-w-none prose-p:font-inter prose-p:leading-relaxed prose-headings:font-headline prose-li:font-inter" 
                   dangerouslySetInnerHTML={{ __html: data.content as string }} 
                 />
               </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
