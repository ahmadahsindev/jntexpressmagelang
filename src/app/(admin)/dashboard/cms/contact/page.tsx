"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function GlobalSettingsPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "content", "settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          setFacebook(data.facebook || "");
          setInstagram(data.instagram || "");
        }
      } catch (error) {
        toast.error("Gagal mengambil data properti Kontak");
      } finally {
        setIsFetching(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Menyimpan pengaturan global...");
    try {
      const docRef = doc(db, "content", "settings");
      await setDoc(docRef, {
        email,
        phone,
        address,
        facebook,
        instagram,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      toast.success("Pengaturan berhasil disimpan!", { id: toastId });
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className="p-8 text-on-surface-variant font-bold">Memuat pengaturan...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Pengaturan Kontak</h1>
          <p className="text-on-surface-variant mt-1">Konfigurasi alamat pusat dan kontak J&T Magelang</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-xl border border-border space-y-8">
        
        {/* Kontak Sentral */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-headline border-b border-border pb-2">Informasi Kontak</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-on-surface text-sm">Nomor WhatsApp / Phone</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="+62 811-234-5678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-on-surface text-sm">Alamat Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="cs@jntexpressmagelang.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Alamat */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-headline border-b border-border pb-2">Lokasi Kantor Pusat</h3>
          <div className="space-y-2">
            <label className="font-bold text-on-surface text-sm">Alamat Lengkap</label>
             <textarea 
               required
               rows={4}
               className="w-full px-4 py-3 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm resize-none"
               placeholder="Jl. Jenderal Sudirman No. 123, Magelang Tengah..."
               value={address}
               onChange={e => setAddress(e.target.value)}
             ></textarea>
          </div>
        </div>

        {/* Sosial Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-headline border-b border-border pb-2">Sosial Media URL</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-on-surface text-sm">Facebook URL</label>
              <input 
                type="url" 
                className="w-full px-4 py-3 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="https://facebook.com/..."
                value={facebook}
                onChange={e => setFacebook(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-on-surface text-sm">Instagram URL</label>
              <input 
                type="url" 
                className="w-full px-4 py-3 rounded-md bg-surface border border-border focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                placeholder="https://instagram.com/..."
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
           <button 
            type="submit" 
            disabled={isLoading}
            className="kinetic-authority-gradient text-white px-8 py-3 rounded-md font-bold tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {isLoading ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
