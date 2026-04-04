"use client";

import { useState, useEffect, useRef } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { ImagePlus, Save, CheckCircle2 } from "lucide-react";

interface AdminHeroManagerProps {
  bannerUrl: string;
  bannerTitle: string;
  bannerSubtitle: string;
  onUrlChange: (url: string) => void;
  onTitleChange: (title: string) => void;
  onSubtitleChange: (subtitle: string) => void;
  collectionName: string; // Needed for direct image auto-save
  docId: string;          // Needed for direct image auto-save
}

export function AdminHeroManager({ 
  bannerUrl, 
  bannerTitle, 
  bannerSubtitle,
  onUrlChange,
  onTitleChange,
  onSubtitleChange,
  collectionName,
  docId
}: AdminHeroManagerProps) {
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Mengunggah banner...");
    try {
      const url = await uploadToCloudinary(file);
      onUrlChange(url);
      
      // Auto-save JUST the image URL directly to Firestore as per previous requirement
      await setDoc(doc(db, collectionName, docId), { bannerUrl: url }, { merge: true });
      
      toast.success("Banner berhasil diunggah & disimpan!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-border space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold font-headline">Banner Utama (Hero Section)</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
           <label className="font-bold text-on-surface text-sm">Judul Banner (Title)</label>
           <input 
             type="text" 
             className="w-full px-4 py-2 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 outline-none"
             placeholder="Contoh: Judul Halaman"
             value={bannerTitle}
             onChange={e => onTitleChange(e.target.value)}
           />
        </div>
        <div className="space-y-2">
           <label className="font-bold text-on-surface text-sm">Sub-judul Banner (Subtitle)</label>
           <input 
             type="text" 
             className="w-full px-4 py-2 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 outline-none"
             placeholder="Contoh: Subtitle singkat halaman ini..."
             value={bannerSubtitle}
             onChange={e => onSubtitleChange(e.target.value)}
           />
        </div>
      </div>

      <div className="mt-4">
        <label className="font-bold text-on-surface text-sm mb-2 flex items-center gap-2">
          Gambar Background (Wajib)
        </label>
        {bannerUrl ? (
           <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-border bg-surface-container">
             <img src={bannerUrl} alt="Hero Banner Preview" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <label className="cursor-pointer bg-white/20 backdrop-blur-md px-4 py-2 rounded-md font-bold text-white flex items-center gap-2">
                 <ImagePlus size={18} /> Ganti Banner (Otomatis Tersimpan)
                 <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
               </label>
             </div>
           </div>
        ) : (
           <label className="w-full h-48 md:h-64 rounded-xl bg-surface-container flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-border cursor-pointer hover:bg-surface-container-high transition-colors mb-4">
              <ImagePlus size={32} className="mb-2" />
              <span className="font-bold">Unggah Banner Baru</span>
              <span className="text-xs mt-1">Gambar akan langsung tersimpan otomatis</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
           </label>
        )}
      </div>
    </div>
  );
}
