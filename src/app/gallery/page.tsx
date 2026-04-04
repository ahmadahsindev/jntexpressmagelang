"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicHero } from "@/components/layout/PublicHero";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, orderBy, query, doc, getDoc } from "firebase/firestore";

interface GalleryData {
  id: string;
  title?: string;
  url: string;
  publishedAt: string;
}

interface GallerySettings {
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export default function PublicGalleryPage() {
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [settings, setSettings] = useState<GallerySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsSnap, querySnapshot] = await Promise.all([
          getDoc(doc(db, "content", "gallery_page")),
          getDocs(query(collection(db, "gallery"), orderBy("publishedAt", "desc")))
        ]);

        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as GallerySettings);
        }

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryData[];
        setGalleries(data);
      } catch (error) {
        console.error("Gagal mengambil data galeri", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-surface-container-lowest min-h-screen pb-24">
        <PublicHero 
          bannerUrl={settings?.bannerUrl}
          bannerTitle={settings?.bannerTitle}
          bannerSubtitle={settings?.bannerSubtitle}
          fallbackTitle="Galeri Dokumentasi"
        />

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto px-6 mt-16">
          {galleries.length === 0 ? (
             <div className="text-center py-24 border-2 border-dashed border-outline-variant rounded-2xl">
               <p className="text-xl font-bold text-on-surface-variant font-headline uppercase">Belum Ada Gambar</p>
               <p className="mt-2 text-on-surface-variant/80">Galeri dokumentasi akan segera diperbarui.</p>
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleries.map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30">
                  <div className="aspect-square bg-surface-container overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.url} 
                      alt={item.title || "Dokumentasi J&T"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Overlay Title (Visible on Hover) */}
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-bold text-sm tracking-wide line-clamp-2">
                         {item.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
