"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArrowRight, CalendarDays } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import Link from "next/link";
import { ResiSearchForm } from "@/components/resi/ResiSearchForm";

interface HomeContent {
  slogan: string;
  description: string;
  bannerUrl: string;
}

interface AboutContent {
  history?: string;
  values?: string;
  recent?: string;
  visionMission?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
}

interface FeaturesContent {
  content?: string;
}

interface GalleryData {
  id: string;
  title?: string;
  url: string;
  publishedAt: string;
}

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  publishedAt: string;
}

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [features, setFeatures] = useState<FeaturesContent | null>(null);
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          homeSnap,
          aboutSnap,
          servicesSnap,
          featuresSnap,
          galleriesSnap,
          blogsSnap
        ] = await Promise.all([
          getDoc(doc(db, "content", "home")),
          getDoc(doc(db, "content", "about")),
          getDocs(query(collection(db, "services"))),
          getDoc(doc(db, "content", "features")),
          getDocs(query(collection(db, "gallery"), orderBy("publishedAt", "desc"), limit(4))),
          getDocs(query(collection(db, "blogs"), orderBy("publishedAt", "desc"), limit(3)))
        ]);

        if (homeSnap.exists()) setContent(homeSnap.data() as HomeContent);
        if (aboutSnap.exists()) setAbout(aboutSnap.data() as AboutContent);
        setServices(servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem)));
        if (featuresSnap.exists()) setFeatures(featuresSnap.data() as FeaturesContent);
        setGalleries(galleriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryData)));
        setBlogs(blogsSnap.docs.map(d => ({ id: d.id, ...d.data() } as BlogData)));

      } catch (err) {
        console.error("Failed to fetch home content", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <PublicLayout>
      {/* 1. Hero Section */}
      <section className="relative min-h-screen 2xl:h-[870px] flex items-center">
        <div className="absolute inset-0 z-0 bg-surface-container-highest overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-20 md:mt-0">
          <div className="max-w-xl">
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-white mb-6 tracking-tighter leading-tight shadow-sm">
              J&T Express Magelang
            </h1>
            {content?.slogan && (
              <p className="text-xl md:text-2xl font-inter text-white font-medium mb-6 opacity-95 border-l-4 border-primary pl-6 drop-shadow-md">
                {content.slogan}
              </p>
            )}
            {content?.description && (
               <div 
                 className="text-base md:text-lg text-white/90 mb-10 min-h-[50px] font-inter leading-relaxed drop-shadow-md"
                 dangerouslySetInnerHTML={{ __html: content.description }}
               />
            )}
            <div className="hidden md:flex flex-wrap gap-4 mt-8">
              <button 
                onClick={() => {
                  (document.querySelector('form input') as HTMLInputElement)?.focus();
                }}
                className="kinetic-authority-gradient text-white px-8 py-4 rounded-md font-bold tracking-wide shadow-xl flex items-center gap-2 uppercase hover:opacity-90 transition-opacity">
                Cek Resi Sekarang <ArrowRight size={20} />
              </button>
              <Link href="/services" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-md font-bold tracking-wide hover:bg-white/20 transition-colors">
                Layanan Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Cek Resi Form Component directly inside Hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-border/50 backdrop-blur-xl">
             <div className="text-center mb-6">
               <h2 className="text-2xl md:text-3xl font-black font-headline text-on-surface uppercase tracking-tight">Cek Resi & Lacak Paket</h2>
               <p className="text-on-surface-variant font-inter text-sm md:text-base mt-2">Masukkan nomor resi J&T Express Magelang Anda</p>
             </div>
             <ResiSearchForm />
          </div>
        </div>
      </section>

      {/* Spacer for Floating Component */}
      <div className="h-32 md:h-24 bg-surface-container-lowest"></div>

      {/* 2. About Section */}
      {(about?.history || about?.visionMission || about?.values) && (
        <section className="py-20 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                 <h2 className="text-3xl md:text-4xl font-black font-headline uppercase tracking-tight text-[#1f2937]">Tentang Kami</h2>
              </div>
              
              {about.history && about.history !== "<p></p>" && (
                <div 
                  className="prose prose-slate max-w-none prose-p:font-inter prose-p:leading-relaxed text-[#4b5563] line-clamp-6"
                  dangerouslySetInnerHTML={{ __html: about.history }}
                />
              )}
              
              <Link href="/about" className="kinetic-authority-gradient text-white px-8 py-3 rounded-md font-bold tracking-wide shadow-xl inline-flex items-center gap-2 uppercase hover:opacity-90 transition-opacity">
                Pelajari Lebih Lanjut <ArrowRight size={20} />
              </Link>
            </div>
            
            {/* Visual representation or some value blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {about.visionMission && about.visionMission !== "<p></p>" && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                   <h3 className="text-xl font-bold font-headline mb-3 text-primary uppercase">Visi & Misi</h3>
                   <div className="prose prose-sm prose-slate line-clamp-5 text-[#4b5563]" dangerouslySetInnerHTML={{ __html: about.visionMission }} />
                 </div>
               )}
               {about.values && about.values !== "<p></p>" && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                   <h3 className="text-xl font-bold font-headline mb-3 text-primary uppercase">Nilai Kami</h3>
                   <div className="prose prose-sm prose-slate line-clamp-5 text-[#4b5563]" dangerouslySetInnerHTML={{ __html: about.values }} />
                 </div>
               )}
            </div>
          </div>
        </section>
      )}

      {/* 3. Layanan Section (Cards Only) */}
      {services.length > 0 && (
        <section className="py-20 bg-[#f2f7fc]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center border-b-2 border-primary inline-block mb-12">
               <h2 className="text-3xl md:text-4xl font-black font-headline uppercase pb-2 text-[#1f2937]">Layanan Kami</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-20">
              {services.map(service => (
                <div key={service.id} className="flex flex-col items-center bg-transparent group">
                  <div className="w-full aspect-square bg-[#e2e8f0] mb-6 overflow-hidden rounded-xl">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-headline text-[#1f2937] text-center mb-3">
                    {service.title}
                  </h3>
                  <div 
                    className="text-[#4b5563] text-center text-sm md:text-base font-inter prose prose-p:leading-relaxed prose-slate max-w-none line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: service.content }} 
                  />
                  <Link href="/services" className="mt-4 text-primary font-bold uppercase text-sm tracking-widest hover:underline decoration-2 underline-offset-4">Lihat Detail</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Keunggulan Section */}
      {features?.content && features.content !== "<p></p>" && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center border-b-2 border-primary inline-block mb-12">
               <h2 className="text-3xl md:text-4xl font-black font-headline uppercase pb-2 text-[#1f2937]">Keunggulan Kami</h2>
            </div>
            <div className="max-w-4xl mx-auto bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-border shadow-sm">
              <div 
                className="prose prose-slate max-w-none prose-p:font-inter prose-p:leading-relaxed prose-headings:font-headline prose-li:font-inter" 
                dangerouslySetInnerHTML={{ __html: features.content as string }} 
              />
            </div>
          </div>
        </section>
      )}

      {/* 5. Gallery Section */}
      {galleries.length > 0 && (
        <section className="py-20 bg-[#f2f7fc]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div className="border-b-2 border-primary inline-block">
                 <h2 className="text-3xl md:text-4xl font-black font-headline uppercase pb-2 text-[#1f2937]">Galeri Foto</h2>
              </div>
              <Link href="/gallery" className="text-primary font-bold uppercase text-sm tracking-widest hover:underline hidden md:inline-block">
                 Lihat Semua
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {galleries.map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/30">
                  <div className="aspect-square bg-surface-container overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title || "Dokumentasi J&T"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
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
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/gallery" className="text-primary font-bold uppercase text-sm tracking-widest underline decoration-2 underline-offset-4">
                 Lihat Semua Galeri
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. Blog Section */}
      {blogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div className="border-b-2 border-primary inline-block">
                 <h2 className="text-3xl md:text-4xl font-black font-headline uppercase pb-2 text-[#1f2937]">Artikel Terbaru</h2>
              </div>
              <Link href="/blog" className="text-primary font-bold uppercase text-sm tracking-widest hover:underline hidden md:inline-block">
                 Semua Artikel
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div key={blog.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-outline-variant/30 flex flex-col group transition-all duration-300">
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
                    <h3 className="text-xl font-black font-headline text-on-surface mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
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
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/blog" className="text-primary font-bold uppercase text-sm tracking-widest underline decoration-2 underline-offset-4">
                 Semua Artikel
              </Link>
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
