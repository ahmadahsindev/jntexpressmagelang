"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, orderBy, query, addDoc, getDoc, setDoc } from "firebase/firestore";
import { Plus, Trash2, ImagePlus, Loader2, Search, Save } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminHeroManager } from "@/components/ui/admin-hero-manager";

interface GalleryData {
  id: string;
  title?: string;
  url: string;
  publishedAt: string;
}

export default function GalleryManagementPage() {
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGalleries = async () => {
    setIsLoading(true);
    try {
      const [settingsSnap, querySnapshot] = await Promise.all([
        getDoc(doc(db, "content", "gallery_page")),
        getDocs(query(collection(db, "gallery"), orderBy("publishedAt", "desc")))
      ]);

      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        setBannerUrl(data.bannerUrl || "");
        setBannerTitle(data.bannerTitle || "");
        setBannerSubtitle(data.bannerSubtitle || "");
      }

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryData[];
      setGalleries(data);
    } catch (error) {
      toast.error("Gagal mengambil data galeri");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handlePageSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan pengaturan halaman...");
    try {
      const docRef = doc(db, "content", "gallery_page");
      await setDoc(docRef, {
        bannerUrl,
        bannerTitle,
        bannerSubtitle,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Halaman galeri berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      toast.error("Gagal: " + err.message, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah gambar...");
    
    try {
      // 1. Upload to Cloudinary
      const url = await uploadToCloudinary(file);
      
      // 2. Save metadata to Firestore
      const newDoc: Omit<GalleryData, "id"> = {
        url,
        publishedAt: new Date().toISOString()
      };

      if (uploadTitle.trim()) {
        newDoc.title = uploadTitle.trim();
      }

      const docRef = await addDoc(collection(db, "gallery"), newDoc);

      toast.success("Gambar berhasil ditambahkan ke galeri", { id: toastId });

      // Update local state
      setGalleries([{ id: docRef.id, ...newDoc }, ...galleries]);
      
      // Reset form
      setUploadTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah gambar", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await deleteDoc(doc(db, "gallery", deleteId));
      toast.success("Gambar berhasil dihapus dari galeri");
      setGalleries(galleries.filter(g => g.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus gambar");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredGalleries = galleries.filter(g => 
    (g.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Manajemen Galeri</h1>
          <p className="text-on-surface-variant mt-1">Kelola foto dan gambar untuk ditampilkan di halaman publik</p>
        </div>
        <button 
          onClick={handlePageSave}
          disabled={isSaving}
          className="kinetic-authority-gradient text-white px-6 py-2.5 rounded-md font-bold tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      <AdminHeroManager 
        bannerUrl={bannerUrl}
        bannerTitle={bannerTitle}
        bannerSubtitle={bannerSubtitle}
        onUrlChange={setBannerUrl}
        onTitleChange={setBannerTitle}
        onSubtitleChange={setBannerSubtitle}
        collectionName="content"
        docId="gallery_page"
      />

      {/* Upload Section */}
      <div className="bg-surface-container-lowest border border-border rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-2">
          <label className="font-bold text-sm text-on-surface">Judul Gambar (Opsional untuk SEO)</label>
          <input 
            type="text" 
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
            placeholder="Masukkan judul gambar..." 
            disabled={isUploading}
          />
        </div>
        <div>
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
            className="w-full py-3 px-4 border-2 border-dashed border-primary rounded-md flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
            {isUploading ? "Memproses Unggahan..." : "Pilih Gambar & Unggah"}
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-surface-container-lowest border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-100">
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-surface flex justify-between items-center shrink-0">
          <div className="relative w-full max-w-sm flex items-center">
             <Search className="absolute left-3 text-on-surface-variant" size={18} />
             <input 
               type="text" 
               placeholder="Cari gambar..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
             />
          </div>
          <div className="text-sm font-bold text-on-surface-variant">
            Total Gambar: {filteredGalleries.length}
          </div>
        </div>

        {/* Grid Content */}
        <div className="p-6 flex-1 bg-surface-container-low">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-on-surface-variant font-bold">
              Memuat data galeri...
            </div>
          ) : filteredGalleries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant gap-2 pt-10">
              <ImagePlus size={48} className="text-outline-variant" />
              <p>{searchTerm ? "Tidak ada gambar yang cocok dengan pencarian." : "Belum ada gambar yang diunggah."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGalleries.map((item) => (
                <div key={item.id} className="group bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-square relative overflow-hidden bg-surface-container">
                    <img 
                      src={item.url} 
                      alt={item.title || "Gallery Image"} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    
                    {/* Delete Button (Visible on Hover) */}
                    <button 
                      onClick={() => setDeleteId(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      title="Hapus Gambar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-on-surface truncate" title={item.title || "Tanpa Judul"}>
                      {item.title || <span className="text-on-surface-variant font-normal italic">Tanpa Judul</span>}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {new Date(item.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gambar?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus gambar ini dari galeri?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 font-bold"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
