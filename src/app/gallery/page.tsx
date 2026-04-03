"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface GalleryData {
  id: string;
  title?: string;
  url: string;
  publishedAt: string;
}

export default function PublicGalleryPage() {
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const q = query(collection(db, "gallery"), orderBy("publishedAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
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
    
    fetchGalleries();
  }, []);

  return (
    <PublicLayout>
      <div className="bg-surface-container-lowest min-h-screen pb-24">
        {/* Header Hero */}
        <section className="bg-primary_container text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tight uppercase">
              Galeri Dokumentasi
            </h1>
            <p className="text-white/80 font-inter text-lg max-w-2xl mx-auto">
              Lihat berbagai momen dan dokumentasi kegiatan pengiriman J&T Express area Magelang.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto px-6 mt-16">
          {isLoading ? (
            <div className="flex justify-center items-center py-24 text-on-surface-variant font-bold">
              Memuat galeri...
            </div>
          ) : galleries.length === 0 ? (
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
