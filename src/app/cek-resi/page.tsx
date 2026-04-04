"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicHero } from "@/components/layout/PublicHero";
import { Printer, MapPin, CheckCircle2, ChevronRight, Search } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { PrintTemplate, ReceiptData } from "@/components/resi/PrintTemplate";
import { ResiSearchForm } from "@/components/resi/ResiSearchForm";
import { useSearchParams } from "next/navigation";

interface CekResiSettings {
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

function CekResiContent() {
  const searchParams = useSearchParams();
  const qParams = searchParams.get("q");

  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [settings, setSettings] = useState<CekResiSettings | null>(null);
  
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Resi-${receipt?.receiptNumber || 'JNT'}`,
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const snap = await getDoc(doc(db, "content", "cekresi_page"));
        if (snap.exists()) {
          setSettings(snap.data() as CekResiSettings);
        }
      } catch (err) {
        console.error("Failed to fetch cek resi settings", err);
      } finally {
        setIsSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (qParams) {
      handleSearch(qParams.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParams]);

  if (isSettingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;

    setIsLoading(true);
    try {
      const q = query(
        collection(db, "receipts"),
        where("receiptNumber", "==", queryText.trim().toUpperCase())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
         const docData = querySnapshot.docs[0].data() as ReceiptData;
         const sortedHistory = [...(docData.statusHistory || [])].sort(
           (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
         );
         setReceipt({ ...docData, statusHistory: sortedHistory });
         toast.success("Resi ditemukan!");
      } else {
         setReceipt(null);
         toast.error("Nomor Resi Tidak Ditemukan");
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan sistem: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <>
      <div className="bg-surface-container-lowest min-h-[50vh]">
        {/* Full Width Hero */}
        <PublicHero 
          bannerUrl={settings?.bannerUrl}
          bannerTitle={settings?.bannerTitle}
          bannerSubtitle={settings?.bannerSubtitle}
          fallbackTitle="Cek Resi & Lacak Paket"
        />

        {/* Search Bar - Overlapping Hero or just below */}
        <div className="mt-16 pb-24 max-w-4xl mx-auto px-6 -mt-16 relative z-20 mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-border/50">
             <div className="text-center mb-6">
               <p className="text-on-surface-variant font-inter font-medium text-sm md:text-base">
                 Masukkan nomor resi J&T Express Magelang Anda.
               </p>
             </div>
             <ResiSearchForm initialValue={qParams || ""} onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Results Level */}
        {receipt && (
          <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Shipment Info */}
            <div className="lg:col-span-7 space-y-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex justify-between items-center bg-gradient-to-br from-white to-surface-container-low">
                 <div>
                    <p className="text-sm text-on-surface-variant font-bold mb-1">Status Pengiriman</p>
                    <h2 className="text-3xl font-black font-headline text-primary uppercase">{receipt.currentStatus}</h2>
                    <p className="text-sm mt-1">{formatDate(receipt.createdAt)}</p>
                 </div>
                 <div className="flex flex-col gap-2">
                   <button 
                      onClick={() => handlePrint()}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm shadow-md transition-colors"
                   >
                     <Printer size={16} /> Print Document
                   </button>
                 </div>
               </div>

               {/* Sender / Receiver Cards Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Asal Data */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                   <div className="flex items-center gap-2 mb-4 text-primary">
                     <MapPin size={20} />
                     <h3 className="font-bold text-lg font-headline uppercase">Data Pengirim</h3>
                   </div>
                   <div className="space-y-3 font-inter text-sm">
                      <div>
                        <p className="text-on-surface-variant opacity-70">Nama</p>
                        <p className="font-bold uppercase text-on-surface">{receipt.sender.name}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant opacity-70">Telepon</p>
                        <p className="font-bold text-on-surface">{receipt.sender.phone}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant opacity-70">Alamat</p>
                        <p className="font-semibold text-on-surface uppercase opacity-90">{receipt.sender.address}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-outline-variant/30">
                        <p className="text-on-surface-variant opacity-70">Asal Kota</p>
                        <p className="font-black text-on-surface">{receipt.origin}</p>
                      </div>
                   </div>
                 </div>

                 {/* Tujuan Data */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30">
                   <div className="flex items-center gap-2 mb-4 text-primary">
                     <ChevronRight size={20} />
                     <h3 className="font-bold text-lg font-headline uppercase">Data Penerima</h3>
                   </div>
                   <div className="space-y-3 font-inter text-sm">
                      <div>
                        <p className="text-on-surface-variant opacity-70">Nama</p>
                        <p className="font-bold uppercase text-on-surface">{receipt.receiver.name}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant opacity-70">Telepon / Email</p>
                        <p className="font-bold text-on-surface">{receipt.receiver.phone}</p>
                        <p className="font-medium text-on-surface opacity-80">{receipt.receiver.email}</p>
                      </div>
                      <div>
                        <p className="text-on-surface-variant opacity-70">Alamat</p>
                        <p className="font-semibold text-on-surface uppercase opacity-90">{receipt.receiver.address}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-outline-variant/30">
                        <p className="text-on-surface-variant opacity-70">Tujuan Kota</p>
                        <p className="font-black text-on-surface">{receipt.destination}</p>
                      </div>
                   </div>
                 </div>
               </div>

               {/* Paket Data */}
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/30 font-inter text-sm w-full overflow-x-auto">
                 <h3 className="font-bold text-lg font-headline uppercase mb-4 pb-2 border-b border-outline-variant/30">Detail Paket & Pengiriman</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div>
                     <p className="text-on-surface-variant opacity-70">Jml Barang</p>
                     <p className="font-bold text-on-surface">{receipt.quantity}</p>
                   </div>
                   <div>
                     <p className="text-on-surface-variant opacity-70">Berat (Kg)</p>
                     <p className="font-bold text-on-surface">{receipt.weight}</p>
                   </div>
                   <div>
                     <p className="text-on-surface-variant opacity-70">Berat Volume</p>
                     <p className="font-bold text-on-surface">{receipt.volumeWeight}</p>
                   </div>

                   <div className="md:col-span-2">
                     <p className="text-on-surface-variant opacity-70">Biaya Pengiriman</p>
                     <p className="font-bold text-primary">{formatCurrency(receipt.details.shippingCost)}</p>
                   </div>
                   <div className="md:col-span-4">
                     <p className="text-on-surface-variant opacity-70">Jenis Barang</p>
                     <p className="font-bold text-on-surface uppercase">{receipt.details.itemType}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Right Col: Timeline */}
            <div className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/30">
               <h3 className="font-bold text-xl font-headline uppercase border-b-2 border-primary pb-3 text-on-surface inline-block mb-6">
                 Status Pengiriman
               </h3>
               
               {/* Vertical Stepper */}
               <div className="relative pl-6 border-l-2 border-outline-variant mt-2 space-y-10 py-2">
                 {receipt.statusHistory.map((history, idx) => (
                   <div key={idx} className="relative group">
                     {/* Circular Bullet */}
                     <div className={`absolute -left-[33px] w-4 h-4 rounded-full ring-4 ring-white ${idx === 0 ? 'bg-green-500' : 'bg-outline-variant'}`}>
                       {idx === 0 && <CheckCircle2 className="text-green-500 absolute -top-1 -left-1 bg-white rounded-full" size={24} />}
                     </div>
                     {/* Content */}
                     <div className={`transition-all ${idx !== 0 && 'opacity-60 group-hover:opacity-100'}`}>
                       <p className={`text-sm font-bold ${idx === 0 ? 'text-green-600' : 'text-on-surface-variant'}`}>
                         {formatDate(history.timestamp)}
                       </p>
                       <p className="text-on-surface font-black uppercase tracking-wide mt-1 text-base leading-tight">
                         {history.status}
                       </p>
                       <p className="text-primary font-bold text-sm mt-1 uppercase flex items-center gap-1">
                         <MapPin size={14} /> {history.location}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        )}

      </div>
      
      {/* Hidden Print Wrapper */}
      <div className="hidden">
        <PrintTemplate ref={componentRef} data={receipt} />
      </div>
    </>
  );
}

export default function CekResiPage() {
  return (
    <PublicLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      }>
        <CekResiContent />
      </Suspense>
    </PublicLayout>
  );
}
