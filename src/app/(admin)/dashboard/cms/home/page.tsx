"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ImagePlus, Save } from "lucide-react";

export default function HomeCMSPage() {
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchHomeContent() {
      try {
        const docRef = doc(db, "content", "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSlogan(data.slogan || "");
          setDescription(data.description || "");
          setBannerUrl(data.bannerUrl || "");
        }
      } catch (error) {
        toast.error("Gagal mengambil data Home Page");
      } finally {
        setIsFetching(false);
      }
    }
    fetchHomeContent();
  }, []);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Mengunggah banner utama...");
    try {
      const url = await uploadToCloudinary(file);
      setBannerUrl(url);
      toast.success("Banner berhasil diunggah!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan halaman Home...");
    try {
      const docRef = doc(db, "content", "home");
      await setDoc(docRef, {
        slogan,
        description,
        bannerUrl,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Halaman Home berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      toast.error("Gagal: " + err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-on-surface-variant font-bold">Memuat data konten...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Home Page CMS</h1>
          <p className="text-on-surface-variant mt-1">Kelola banner dan teks halaman utama</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isLoading}
          className="kinetic-authority-gradient text-white px-6 py-2.5 rounded-md font-bold tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={18} />
          {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Banner Section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border">
          <h3 className="text-lg font-bold font-headline mb-4">Banner Utama (Hero Image)</h3>
          
          {bannerUrl ? (
             <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 border border-border">
               {/* Directly using img tag per user request */}
               <img src={bannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <label className="cursor-pointer bg-white/20 backdrop-blur-md px-4 py-2 rounded-md font-bold text-white flex items-center gap-2">
                   <ImagePlus size={18} /> Ganti Banner
                   <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                 </label>
               </div>
             </div>
          ) : (
             <label className="w-full h-64 rounded-xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-border cursor-pointer hover:bg-surface-container-high transition-colors mb-4">
                <ImagePlus size={32} className="mb-2" />
                <span className="font-bold">Unggah Banner Baru</span>
                <span className="text-xs mt-1">Maks. 5MB (Recomendasi 1920x1080)</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
             </label>
          )}
        </div>

        {/* Text Section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border space-y-6">
          <div className="space-y-2">
             <label className="font-bold text-on-surface text-sm">Slogan Utama (Headline)</label>
             <input 
               type="text" 
               className="w-full px-4 py-3 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-headline text-xl font-bold"
               placeholder="Contoh: Kirim Cepat, Aman, Terpercaya Dan Harga Hemat"
               value={slogan}
               onChange={e => setSlogan(e.target.value)}
             />
          </div>

          <div className="space-y-2">
             <label className="font-bold text-on-surface text-sm">Deskripsi (Rich Text)</label>
             <p className="text-xs text-on-surface-variant mb-2">Teks pendukung yang muncul di bawah slogan atau di bagian profil singkat.</p>
             <RichTextEditor content={description} onChange={setDescription} />
          </div>
        </div>
      </div>
    </div>
  );
}
