"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminHeroManager } from "@/components/ui/admin-hero-manager";

export default function FeaturesCMSPage() {
  const [content, setContent] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchFeaturesContent() {
      try {
        const docRef = doc(db, "content", "features");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(data.content || "");
          setBannerUrl(data.bannerUrl || "");
          setBannerTitle(data.bannerTitle || "");
          setBannerSubtitle(data.bannerSubtitle || "");
        }
      } catch (error) {
        toast.error("Gagal mengambil data Keunggulan");
      } finally {
        setIsFetching(false);
      }
    }
    fetchFeaturesContent();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan halaman Keunggulan...");
    try {
      const docRef = doc(db, "content", "features");
      await setDoc(docRef, {
        content,
        bannerUrl,
        bannerTitle,
        bannerSubtitle,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Halaman Keunggulan berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      toast.error("Gagal: " + err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-on-surface-variant font-bold">Memuat data konten...</div>;

  return (
    <div className="px-4 md:px-6 py-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Keunggulan CMS</h1>
          <p className="text-on-surface-variant mt-1">Kelola konten keunggulan pelayanan (Why Choose Us)</p>
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
        {/* Managed Hero Banner Component - Controlled by this page's state */}
        <AdminHeroManager 
          bannerUrl={bannerUrl}
          bannerTitle={bannerTitle}
          bannerSubtitle={bannerSubtitle}
          onUrlChange={setBannerUrl}
          onTitleChange={setBannerTitle}
          onSubtitleChange={setBannerSubtitle}
          collectionName="content"
          docId="features"
        />

        {/* Text Section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border space-y-6">
          <div className="space-y-2">
             <label className="font-bold text-on-surface text-sm">Keunggulan Perusahaan</label>
             <p className="text-xs text-on-surface-variant mb-2">Tuliskan berbagai poin yang menjadi kekuatan serta kelebihan kompetitif dari pelayanan J&T Express Magelang.</p>
             <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
