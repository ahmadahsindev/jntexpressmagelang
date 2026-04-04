"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicHero } from "@/components/layout/PublicHero";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  publishedAt: string;
}

interface BlogSettings {
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsSnap, querySnapshot] = await Promise.all([
          getDoc(doc(db, "content", "blog_page")),
          getDocs(query(collection(db, "blogs"), orderBy("publishedAt", "desc")))
        ]);

        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as BlogSettings);
        }

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BlogData[];
        setBlogs(data);
      } catch (error) {
        console.error("Gagal mengambil data blog", error);
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
          fallbackTitle="Portal Informasi & Blog"
        />

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-6 mt-16">
          {blogs.length === 0 ? (
             <div className="text-center py-24 border-2 border-dashed border-outline-variant rounded-2xl">
               <p className="text-xl font-bold text-on-surface-variant font-headline uppercase">Belum Ada Artikel</p>
               <p className="mt-2 text-on-surface-variant/80">Silakan kembali lagi nanti untuk informasi terbaru.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/30 flex flex-col group transition-all duration-300">
                  <div className="relative h-56 overflow-hidden bg-surface-container">
                    <img 
                      src={blog.thumbnail || "https://placehold.co/600x400"} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-sm uppercase">
                      <CalendarDays size={14} />
                      {new Date(blog.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-2xl font-black font-headline text-on-surface mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-on-surface-variant text-sm font-inter line-clamp-3 mb-6 flex-1">
                      {blog.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide group/link"
                    >
                      Baca Selengkapnya 
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
}
