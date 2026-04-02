"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  content: string;
  publishedAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const q = query(collection(db, "blogs"), where("slug", "==", slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const docData = snapshot.docs[0];
          setBlog({ id: docData.id, ...docData.data() } as BlogData);
        } else {
          setBlog(null);
        }
      } catch (error) {
        console.error("Gagal mengambil rincian blog:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) fetchBlog();
  }, [slug]);

  return (
    <PublicLayout>
      <div className="bg-surface-container-lowest min-h-screen pb-24">
        {isLoading ? (
           <div className="flex justify-center items-center py-40 text-on-surface-variant">
             Memuat artikel...
           </div>
        ) : !blog ? (
          <section className="max-w-4xl mx-auto px-6 py-40 text-center">
            <h1 className="text-4xl font-black font-headline text-on-surface mb-4">404 - Artikel Tidak Ditemukan</h1>
            <p className="text-on-surface-variant text-lg mb-8">Maaf, artikel yang Anda cari mungkin sudah dihapus atau URL tidak valid.</p>
            <Link 
              href="/blog" 
              className="bg-primary hover:bg-primary_container text-white px-8 py-3 rounded-md font-bold transition-colors inline-block uppercase tracking-wide"
            >
              Kembali ke Portal Informasi
            </Link>
          </section>
        ) : (
          <article className="max-w-4xl mx-auto px-6 pt-12">
            
            {/* Header Content */}
            <div className="mb-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:-translate-x-1 transition-transform mb-8 uppercase text-sm">
                <ChevronLeft size={16} /> Kembali ke daftar blog
              </Link>
              
              <h1 className="text-3xl md:text-5xl font-black font-headline text-on-surface leading-tight mb-6">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-4 text-on-surface-variant font-medium text-sm border-y border-outline-variant/30 py-4">
                <div className="flex items-center gap-2">
                   <CalendarDays size={18} className="text-primary" />
                   {new Date(blog.publishedAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
                <div className="uppercase tracking-wide font-bold font-headline text-primary">Admin</div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-12">
              <img 
                src={blog.thumbnail || "https://placehold.co/1200x600"} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body */}
            <div 
              className="w-full max-w-none text-on-surface font-inter text-lg md:text-xl leading-relaxed space-y-6
                [&>p]:mb-6 
                [&>h1]:text-4xl [&>h1]:font-black [&>h1]:mb-6 [&>h1]:mt-10 [&>h1]:font-headline
                [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:font-headline [&>h2]:text-primary
                [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6 [&>h3]:font-headline
                [&>ul]:list-disc [&>ul]:pl-8 [&>ul]:mb-6 [&>ul>li]:mb-2
                [&>ol]:list-decimal [&>ol]:pl-8 [&>ol]:mb-6 [&>ol>li]:mb-2
                [&>img]:max-w-full [&>img]:rounded-2xl [&>img]:shadow-md [&>img]:my-10
                [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-on-surface-variant [&>blockquote]:mb-6
                [&>strong]:font-black [&>em]:italic
              "
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Social Share Section */}
            <div className="mt-16 pt-10 border-t border-outline-variant/30">
              <h3 className="text-xl font-black font-headline text-on-surface uppercase tracking-tight mb-6">Bagikan Artikel Ini</h3>
              <div className="flex flex-wrap gap-4">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title)}%20${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-full bg-[#25D366] text-white font-bold hover:brightness-110 transition-all shadow-md hover:shadow-lg group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.654zm6.749-3.836c1.53.917 3.01 1.403 4.417 1.404 5.273 0 9.564-4.291 9.566-9.564.001-2.555-.992-4.956-2.796-6.76-1.805-1.804-4.207-2.795-6.761-2.796-5.273 0-9.565 4.291-9.567 9.564-.001 1.628.412 3.219 1.2 4.596l-1.063 3.879 3.991-1.047zm11.387-5.463c-.29-.145-1.716-.848-1.982-.944-.266-.096-.459-.145-.653.146-.193.29-.75 1.109-.918 1.206-.168.097-.336.035-.626-.145-.291-.144-1.226-.452-2.336-1.441-.864-.77-1.446-1.721-1.615-2.012-.17-.291-.018-.448.127-.592.13-.13.29-.339.435-.508.145-.17.194-.29.291-.483.097-.193.048-.363-.024-.508-.073-.145-.654-1.573-.895-2.153-.235-.565-.472-.488-.653-.497-.168-.008-.362-.01-.556-.01-.193 0-.508.073-.774.363-.266.29-1.015.992-1.015 2.418 0 1.427 1.039 2.808 1.184 3.001.144.193 2.043 3.119 4.949 4.372.689.301 1.23.48 1.651.614.693.22 1.325.189 1.824.115.557-.083 1.717-.701 1.959-1.378.243-.677.243-1.257.17-1.378-.073-.121-.267-.193-.556-.339z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-full bg-[#1877F2] text-white font-bold hover:brightness-110 transition-all shadow-md hover:shadow-lg group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-full bg-black text-surface-container-lowest font-bold hover:brightness-110 transition-all shadow-md hover:shadow-lg group"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

          </article>
        )}
      </div>
    </PublicLayout>
  );
}
