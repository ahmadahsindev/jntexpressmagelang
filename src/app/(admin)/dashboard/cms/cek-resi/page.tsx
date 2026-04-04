"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminHeroManager } from "@/components/ui/admin-hero-manager";

export default function CekResiCMSPage() {
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "content", "cekresi_page");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBannerUrl(data.bannerUrl || "");
          setBannerTitle(data.bannerTitle || "");
          setBannerSubtitle(data.bannerSubtitle || "");
        }
      } catch (error) {
        toast.error("Gagal mengambil data Cek Resi Page");
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan pengaturan halaman Cek Resi...");
    try {
      const docRef = doc(db, "content", "cekresi_page");
      await setDoc(docRef, {
        bannerUrl,
        bannerTitle,
        bannerSubtitle,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Halaman Cek Resi berhasil diperbarui!", { id: toastId });
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
          <h1 className="text-3xl font-black font-headline text-on-surface">Cek Resi CMS</h1>
          <p className="text-on-surface-variant mt-1">Kelola hero banner halaman Cek Resi</p>
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
        <AdminHeroManager 
          bannerUrl={bannerUrl}
          bannerTitle={bannerTitle}
          bannerSubtitle={bannerSubtitle}
          onUrlChange={setBannerUrl}
          onTitleChange={setBannerTitle}
          onSubtitleChange={setBannerSubtitle}
          collectionName="content"
          docId="cekresi_page"
        />
      </div>
    </div>
  );
}
