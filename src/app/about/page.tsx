"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicHero } from "@/components/layout/PublicHero";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface AboutContent {
  history?: string;
  values?: string;
  recent?: string;
  visionMission?: string;
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, "content", "about"));
        if (snap.exists()) {
          setContent(snap.data() as AboutContent);
        }
      } catch (err) {
        console.error("Failed to fetch about content", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!content) {
    return (
      <PublicLayout>
        <div className="pt-20 md:pt-28 pb-16 min-h-[50vh] flex items-center justify-center">
            <p className="text-on-surface-variant italic">Konten sedang diperbarui.</p>
        </div>
      </PublicLayout>
    );
  }

  const hasContent = content.history || content.values || content.recent || content.visionMission || content.bannerUrl;

  return (
    <PublicLayout>
      {/* Hero Banner Section (Full Width) via Shared Component */}
      <PublicHero 
        bannerUrl={content.bannerUrl}
        bannerTitle={content.bannerTitle}
        bannerSubtitle={content.bannerSubtitle}
        fallbackTitle="Tentang Kami"
      />

      {/* Main Content Area */}
      <div className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {hasContent && (
            <div className="space-y-16">
              {/* Sections Stacked */}
              <div className="grid gap-12 max-w-4xl mx-auto relative z-20">
                {/* History */}
                {content.history && content.history !== "<p></p>" && (
                  <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-border shadow-sm">
                    <h3 className="text-2xl font-black font-headline text-on-surface mb-6 border-l-4 border-primary pl-6 uppercase tracking-tight">Sejarah Perusahaan</h3>
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none prose-p:font-inter prose-p:leading-relaxed prose-headings:font-headline" 
                      dangerouslySetInnerHTML={{ __html: content.history }} 
                    />
                  </div>
                )}

                {/* Vision & Mission */}
                {content.visionMission && content.visionMission !== "<p></p>" && (
                  <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-border shadow-sm">
                    <h3 className="text-2xl font-black font-headline text-on-surface mb-6 border-l-4 border-primary pl-6 uppercase tracking-tight">Visi & Misi</h3>
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none prose-p:font-inter prose-p:leading-relaxed prose-headings:font-headline" 
                      dangerouslySetInnerHTML={{ __html: content.visionMission }} 
                    />
                  </div>
                )}

                {/* Values */}
                {content.values && content.values !== "<p></p>" && (
                  <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-border shadow-sm">
                    <h3 className="text-2xl font-black font-headline text-on-surface mb-6 border-l-4 border-primary pl-6 uppercase tracking-tight">Nilai-Nilai Kami</h3>
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none prose-p:font-inter prose-p:leading-relaxed prose-headings:font-headline" 
                      dangerouslySetInnerHTML={{ __html: content.values }} 
                    />
                  </div>
                )}

                {/* Recent Developments */}
                {content.recent && content.recent !== "<p></p>" && (
                  <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-border shadow-sm">
                    <h3 className="text-2xl font-black font-headline text-on-surface mb-6 border-l-4 border-primary pl-6 uppercase tracking-tight">Perkembangan Terkini</h3>
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none prose-p:font-inter prose-p:leading-relaxed prose-headings:font-headline" 
                      dangerouslySetInnerHTML={{ __html: content.recent }} 
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
