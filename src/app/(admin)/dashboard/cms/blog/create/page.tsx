"use client";

import { useState, useRef } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function CreateBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [content, setContent] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const generateExcerpt = (html: string) => {
    // Basic HTML strip
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > 150 ? text.substring(0, 150) + "..." : text;
  };
  const excerpt = generateExcerpt(content);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah sampul...");
    try {
      const url = await uploadToCloudinary(file);
      setThumbnail(url);
      toast.success("Sampul berhasil diunggah", { id: toastId });
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
      await addDoc(collection(db, "blogs"), {
        title,
        slug,
        excerpt,
        thumbnail,
        content,
        publishedAt: new Date().toISOString()
      });
      
      toast.success("Artikel berhasil dipublikasikan!");
      router.push("/dashboard/cms/blog");
    } catch (error) {
      toast.error("Gagal mempublikasikan artikel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cms/blog" className="p-2 hover:bg-surface-container rounded-md transition-colors">
            <ArrowLeft size={24} className="text-on-surface" />
          </Link>
          <div>
            <h1 className="text-3xl font-black font-headline text-on-surface">Tulis Artikel Baru</h1>
            <p className="text-on-surface-variant mt-1">Publikasi blog post yang informatif</p>
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
                   <span className="text-xs font-bold">{thumbnail ? "Ganti Sampul (Opsional)" : "Unggah Sampul Blog"}</span>
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
            {isLoading ? "Mempublikasikan..." : "Publikasikan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
}
