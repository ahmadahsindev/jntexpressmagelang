"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface BlogData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  content: string;
  publishedAt: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [content, setContent] = useState("");
  const [originalPublishedAt, setOriginalPublishedAt] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const generateExcerpt = (html: string) => {
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };
  const excerpt = generateExcerpt(content);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as BlogData;
          setTitle(data.title);
          setThumbnail(data.thumbnail);
          setContent(data.content);
          setOriginalPublishedAt(data.publishedAt);
        } else {
          toast.error("Artikel tidak ditemukan");
          router.push("/dashboard/cms/blog");
        }
      } catch (error) {
        toast.error("Gagal mengambil data artikel");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchBlog();
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah sampul...");
    try {
      const url = await uploadToCloudinary(file);
      setThumbnail(url);
      toast.success("Sampul berhasil diperbarui", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Judul dan isi artikel wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "blogs", id), {
        title,
        slug,
        excerpt,
        thumbnail,
        content,
        // Keep original published date, or you can add a new updated_at field
        publishedAt: originalPublishedAt || new Date().toISOString()
      });
      
      toast.success("Perubahan artikel berhasil disimpan!");
      router.push("/dashboard/cms/blog");
    } catch (error) {
      toast.error("Gagal menyimpan perubahan artikel");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-on-surface-variant">Memuat data artikel...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cms/blog" className="p-2 hover:bg-surface-container rounded-md transition-colors">
            <ArrowLeft size={24} className="text-on-surface" />
          </Link>
          <div>
            <h1 className="text-3xl font-black font-headline text-on-surface">Edit Artikel</h1>
            <p className="text-on-surface-variant mt-1">Perbarui detail, teks, atau gambar cover blog</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Input Details */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="font-bold text-sm">Judul Artikel</label>
            <input 
              required 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full px-4 py-3 border border-border rounded-md text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
              placeholder="Masukkan judul artikel yang menarik..." 
            />
          </div>



          {/* Thumbnail */}
          <div className="space-y-2">
            <label className="font-bold text-sm">Sampul Blog (Thumbnail)</label>
            <div className="flex gap-4 items-end">
               {thumbnail && (
                 <div className="w-32 h-20 rounded-md overflow-hidden bg-surface-container border border-border shrink-0 shadow-sm relative group">
                   <img src={thumbnail} alt="Sampul" className="w-full h-full object-cover" />
                 </div>
               )}
               <div className="flex-1">
                 <input 
                   type="hidden" 
                   value={thumbnail} 
                 />
                 <input 
                   type="file" 
                   accept="image/*"
                   className="hidden" 
                   ref={fileInputRef}
                   onChange={handleImageUpload}
                 />
                 <button 
                   type="button" 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isUploading}
                   className="w-full h-20 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:bg-surface-container-high hover:text-primary hover:border-primary transition-all disabled:opacity-50"
                 >
                   {isUploading ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
                   <span className="text-xs font-bold">{thumbnail ? "Ganti Sampul" : "Unggah Sampul Blog"}</span>
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm space-y-4">
          <label className="font-bold text-sm">Isi Konten Artikel</label>
          <RichTextEditor 
             content={content}
             onChange={setContent}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end border-t border-border pt-6 pb-10">
          <button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="kinetic-authority-gradient text-white px-10 py-3 rounded-md font-bold tracking-wide shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={20} />
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
