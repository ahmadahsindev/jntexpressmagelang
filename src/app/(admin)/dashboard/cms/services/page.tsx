"use client";

import { useState, useEffect } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { db } from "@/lib/firebase/config";
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { toast } from "sonner";
import { ImagePlus, Plus, Edit, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AdminHeroManager } from "@/components/ui/admin-hero-manager";

interface ServiceItem {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  createdAt?: string;
}

export default function ServicesCMSPage() {
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formContent, setFormContent] = useState("");
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Delete Dialog States
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch hero banner settings
        const docRef = doc(db, "content", "services_page");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBannerUrl(data.bannerUrl || "");
          setBannerTitle(data.bannerTitle || "");
          setBannerSubtitle(data.bannerSubtitle || "");
        }

        // Fetch services
        const q = query(collection(db, "services"));
        const querySnapshot = await getDocs(q);
        const fetchedServices = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem));
        setServices(fetchedServices);

      } catch (error) {
        toast.error("Gagal mengambil data Layanan");
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, []);

  const handlePageSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan pengaturan halaman...");
    try {
      const docRef = doc(db, "content", "services_page");
      await setDoc(docRef, {
        bannerUrl,
        bannerTitle,
        bannerSubtitle,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Pengaturan halaman berhasil diperbarui!", { id: toastId });
    } catch (err: any) {
      toast.error("Gagal: " + err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Mengunggah gambar layanan...");
    try {
      const url = await uploadToCloudinary(file);
      setFormImageUrl(url);
      toast.success("Gambar berhasil diunggah!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const openAddDialog = () => {
    setEditingId(null);
    setFormTitle("");
    setFormImageUrl("");
    setFormContent("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ServiceItem) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormImageUrl(item.imageUrl);
    setFormContent(item.content);
    setIsDialogOpen(true);
  };

  const submitItem = async () => {
    if (!formTitle || !formImageUrl) {
      toast.error("Judul dan gambar wajib diisi!");
      return;
    }
    setIsSavingItem(true);
    const toastId = toast.loading("Menyimpan data layanan...");
    try {
      if (editingId) {
        // Update
        const ref = doc(db, "services", editingId);
        await updateDoc(ref, {
          title: formTitle,
          imageUrl: formImageUrl,
          content: formContent
        });
        setServices(services.map(s => s.id === editingId ? { ...s, title: formTitle, imageUrl: formImageUrl, content: formContent } : s));
      } else {
        // Create
        const docRef = await addDoc(collection(db, "services"), {
          title: formTitle,
          imageUrl: formImageUrl,
          content: formContent,
          createdAt: new Date().toISOString()
        });
        setServices([...services, { id: docRef.id, title: formTitle, imageUrl: formImageUrl, content: formContent }]);
      }
      toast.success("Layanan berhasil disimpan!", { id: toastId });
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan data", { id: toastId });
    } finally {
      setIsSavingItem(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, "services", deleteId));
      setServices(services.filter(s => s.id !== deleteId));
      toast.success("Layanan berhasil dihapus");
    } catch (err) {
      toast.error("Gagal menghapus layanan");
    } finally {
      setDeleteId(null);
    }
  };

  if (isFetching) return <div className="p-8 text-on-surface-variant font-bold">Memuat data konten...</div>;

  return (
    <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Manajemen Layanan</h1>
          <p className="text-on-surface-variant mt-1">Atur kartu Layanan Kami (Cards) dan Hero Banner halaman</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={openAddDialog}
            className="kinetic-authority-gradient text-white px-4 py-2.5 rounded-md font-bold text-sm tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> Tambah Layanan
          </button>
          <button 
            onClick={handlePageSave} 
            disabled={isLoading}
            className="bg-surface-container-high border border-border text-on-surface px-4 py-2.5 rounded-md font-bold text-sm tracking-wide shadow-sm flex items-center gap-2 hover:bg-surface-container-highest transition-opacity disabled:opacity-50"
          >
            <Save size={18} /> {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
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
          docId="services_page"
        />

        {/* Card Services Grid (Admin Preview) */}
        <div>
           <h3 className="text-lg font-bold font-headline mb-4">Daftar Layanan</h3>
           {services.length === 0 ? (
             <div className="bg-surface-container py-12 rounded-xl border border-dashed border-border text-center text-on-surface-variant font-bold">
               Belum ada data layanan ditambahkan.
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {services.map(service => (
                  <div key={service.id} className="bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col group">
                    <div className="w-full aspect-video md:aspect-4/3 bg-surface-container relative">
                       <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button onClick={() => openEditDialog(service)} className="p-2 bg-white rounded-md text-slate-800 hover:text-primary shadow-sm" title="Edit">
                            <Edit size={18} />
                         </button>
                         <button onClick={() => setDeleteId(service.id)} className="p-2 bg-white rounded-md text-slate-800 hover:text-red-600 shadow-sm" title="Delete">
                            <Trash2 size={18} />
                         </button>
                       </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-black font-headline text-lg line-clamp-2 md:truncate">{service.title}</h4>
                      <div className="text-sm text-on-surface-variant mt-2 line-clamp-3 font-inter prose prose-sm prose-p:-mt-1" dangerouslySetInnerHTML={{ __html: service.content }}></div>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Form Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline font-black text-2xl">{editingId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <div>
                  <label className="font-bold text-sm block mb-1">Judul Layanan <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-border rounded-md outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="Contoh: Pengiriman Jalur Udara"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                  />
               </div>
               <div>
                  <label className="font-bold text-sm block mb-1">Gambar/Ilustrasi <span className="text-red-500">*</span></label>
                  {formImageUrl ? (
                     <div className="relative w-48 aspect-video md:aspect-4/3 rounded-lg overflow-hidden border border-border">
                       <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                       <label className="absolute inset-0 bg-black/50 cursor-pointer flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                          Ganti
                          <input type="file" className="hidden" accept="image/*" onChange={handleItemImageUpload} />
                       </label>
                     </div>
                  ) : (
                     <label className="w-48 aspect-video md:aspect-4/3 rounded-lg bg-surface flex flex-col items-center justify-center border border-dashed border-border cursor-pointer hover:bg-surface-container-low transition-colors">
                        <ImagePlus size={24} className="text-on-surface-variant mb-2" />
                        <span className="text-xs font-bold text-on-surface-variant">Browser file</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleItemImageUpload} />
                     </label>
                  )}
                  <p className="text-xs text-on-surface-variant mt-1">Sangat disarankan menggunakan rasio / ukuran proporsi yang seragam antar layanan (cth: 4:3).</p>
               </div>
               <div>
                  <label className="font-bold text-sm block mb-1">Deskripsi Layanan (Rich Text)</label>
                  <RichTextEditor content={formContent} onChange={setFormContent} />
               </div>
            </div>
            <DialogFooter>
               <button 
                 onClick={() => setIsDialogOpen(false)}
                 className="px-4 py-2 border border-border text-on-surface rounded-md font-bold text-sm hover:bg-surface-container-high transition-colors disabled:opacity-50"
                 disabled={isSavingItem}
               >
                 Batal
               </button>
               <button 
                 onClick={submitItem}
                 className="px-4 py-2 bg-primary text-white rounded-md font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                 disabled={isSavingItem}
               >
                 {isSavingItem ? "Menyimpan..." : "Simpan Layanan"}
               </button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Layanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus layanan ini? Data yang terhapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
