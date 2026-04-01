"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface HomeContent {
  slogan: string;
  description: string;
  bannerUrl: string;
}

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const snap = await getDoc(doc(db, "content", "home"));
        if (snap.exists()) {
          setContent(snap.data() as HomeContent);
        }
      } catch (err) {
        console.error("Failed to fetch home content", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const defaultBanner = "https://lh3.googleusercontent.com/aida-public/AB6AXuCWmxWMLmsHvCM1OU4qHJAvWcUMKtU20XKZvoFgnVKL_AkhId9OMX6R6aSFsnS_aAlAxkNgmRcai3FMoq9_744i14oMH5RHlIks7nL_Grwm2kOncfMCAz0OOgfQ9qmH6FRidS2z9PXvm7hOzBa1bpduD-lPJrD7J0cixexBQ98Qdsi7nxbwI9rKZjfcmFteoASb9kWfxZ4rlA59x222JQxFQv-uDfW2Y1TD78ZVWiuMdGC0Db9wAT3nckAcB80VKtqyr-LIdDb1fPcJ";

  return (
    <PublicLayout>
      <section className="relative h-[870px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-surface-container-highest">
          {content?.bannerUrl && (
            <img 
              src={content.bannerUrl} 
              alt="Hero Banner" 
              className="w-full h-full object-cover transition-opacity duration-700" 
              style={{ opacity: loading ? 0 : 1 }}
            />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl">
            <h1 className="font-headline font-extrabold text-6xl text-white mb-6 tracking-tighter leading-tight">
              J&T Express Magelang
            </h1>
            {content?.slogan && (
              <p className="text-2xl font-inter text-white font-medium mb-6 opacity-90 border-l-4 border-primary pl-6">
                {content.slogan}
              </p>
            )}
            {content?.description && (
               <div 
                 className="text-lg text-white/80 mb-10 min-h-[50px] font-inter leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: content.description }}
               />
            )}
            <div className="flex gap-4">
              <button className="kinetic-authority-gradient text-white px-8 py-4 rounded-md font-bold tracking-wide shadow-xl flex items-center gap-2 uppercase hover:opacity-90 transition-opacity">
                Mulai Kirim <ArrowRight size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-md font-bold tracking-wide hover:bg-white/20 transition-colors">
                Layanan Kami
              </button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
