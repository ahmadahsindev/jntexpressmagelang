"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminHeroManager } from "@/components/ui/admin-hero-manager";

export default function AboutCMSPage() {
  const [history, setHistory] = useState("");
  const [values, setValues] = useState("");
  const [recent, setRecent] = useState("");
  const [visionMission, setVisionMission] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchAboutContent() {
      try {
        const docRef = doc(db, "content", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHistory(data.history || "");
          setValues(data.values || "");
          setRecent(data.recent || "");
          setVisionMission(data.visionMission || "");
          setBannerUrl(data.bannerUrl || "");
          setBannerTitle(data.bannerTitle || "");
          setBannerSubtitle(data.bannerSubtitle || "");
        }
      } catch (error) {
        toast.error("Gagal mengambil data About Page");
      } finally {
        setIsFetching(false);
      }
    }
    fetchAboutContent();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan halaman Tentang Kami...");
    try {
      const docRef = doc(db, "content", "about");
      await setDoc(docRef, {
        history,
        values,
        recent,
        visionMission,
        bannerUrl,
        bannerTitle,
        bannerSubtitle,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Halaman Tentang Kami berhasil diperbarui!", { id: toastId });
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
          <h1 className="text-3xl font-black font-headline text-on-surface">Tentang Kami CMS</h1>
          <p className="text-on-surface-variant mt-1">Kelola konten profil dan informasi perusahaan</p>
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
          docId="about"
        />

        {/* Text Sections */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border space-y-6">
          <div className="space-y-2">
             <label className="font-bold text-on-surface text-sm">Sejarah Perusahaan</label>
             <p className="text-xs text-on-surface-variant mb-2">Jelaskan latar belakang dan perjalanan awal hingga sekarang.</p>
             <RichTextEditor content={history} onChange={setHistory} />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
             <label className="font-bold text-on-surface text-sm">Visi & Misi</label>
             <p className="text-xs text-on-surface-variant mb-2">Tujuan utama dan komitmen pelayanan.</p>
             <RichTextEditor content={visionMission} onChange={setVisionMission} />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
             <label className="font-bold text-on-surface text-sm">Nilai-Nilai Kami</label>
             <p className="text-xs text-on-surface-variant mb-2">Core values yang dijunjung tinggi dalam pekerjaan sehari-hari.</p>
             <RichTextEditor content={values} onChange={setValues} />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
             <label className="font-bold text-on-surface text-sm">Perkembangan Terkini</label>
             <p className="text-xs text-on-surface-variant mb-2">Capaian, penambahan jangkauan pelayanan, atau perluasan sistem terbaru.</p>
             <RichTextEditor content={recent} onChange={setRecent} />
          </div>
        </div>
      </div>
    </div>
  );
}