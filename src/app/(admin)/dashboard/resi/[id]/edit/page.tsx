"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save, ArrowLeft, Plus, MapPin, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ReceiptData } from "@/components/resi/PrintTemplate";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditResiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Track Status Edit
  const [newStatus, setNewStatus] = useState("SHIPPED");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  
  // Full Receipt State mapped exactly to ReceiptData
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    const fetchResi = async () => {
      try {
        const docRef = doc(db, "receipts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ReceiptData;
          setReceipt(data);
          setNewStatus(data.currentStatus || "SHIPPED");
        } else {
          toast.error("Resi tidak ditemukan");
          router.push("/dashboard/resi");
        }
      } catch (error) {
        toast.error("Gagal mengambil data resi");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) fetchResi();
  }, [id, router]);

  const handeSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receipt) return;
    setIsLoading(true);

    let finalReceipt = receipt;
    
    const currentTopStatus = receipt.statusHistory[0]?.status;
    const isStatusChanged = newStatus && newStatus !== currentTopStatus;
    const isDescriptionFilled = newDescription.trim() !== "";
    const isLocationFilled = newLocation.trim() !== "";
    
    if (isStatusChanged || isDescriptionFilled || isLocationFilled) {
      const newHistoryEntry = {
        status: newStatus.toUpperCase(),
        description: newDescription.toUpperCase(),
        location: newLocation.toUpperCase(),
        timestamp: new Date().toISOString()
      };
      finalReceipt = {
        ...receipt,
        statusHistory: [newHistoryEntry, ...receipt.statusHistory],
        currentStatus: newHistoryEntry.status
      };
    }
    
    try {
      await updateDoc(doc(db, "receipts", id), {
        ...finalReceipt,
        currentStatus: finalReceipt.statusHistory[0]?.status || finalReceipt.currentStatus
      });
      toast.success("Perubahan data resi berhasil disimpan");
      router.push("/dashboard/resi");
    } catch (error) {
      toast.error("Gagal mengupdate resi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStatus = () => {
    if (!receipt || !newStatus) {
      toast.error("Status harus dipilih");
      return;
    }

    const newHistoryEntry = {
      status: newStatus.toUpperCase(),
      description: newDescription.toUpperCase(),
      location: newLocation.toUpperCase(),
      timestamp: new Date().toISOString()
    };

    setReceipt({
      ...receipt,
      statusHistory: [newHistoryEntry, ...receipt.statusHistory],
      currentStatus: newHistoryEntry.status
    });

    setNewStatus(newHistoryEntry.status);
    setNewDescription("");
    setNewLocation("");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'MASIH DIPROSES (PENDING)';
      case 'SHIPPED': return 'SEDANG DIKIRIM (SHIPPED)';
      case 'DELIVERED': return 'TERKIRIM (DELIVERED)';
      case 'FAILED': return 'GAGAL KIRIM (FAILED)';
      default: return status;
    }
  };

  if (isFetching) return <div className="p-8">Memuat data resi...</div>;
  if (!receipt) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 flex flex-col min-h-full">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/resi" className="p-2 hover:bg-surface-container rounded-md transition-colors">
            <ArrowLeft size={24} className="text-on-surface" />
          </Link>
          <div>
            <h1 className="text-3xl font-black font-headline text-on-surface">Edit Resi: {receipt.receiptNumber}</h1>
            <p className="text-on-surface-variant mt-1">Perbarui detail pengiriman atau penambahan status lacak baru</p>
          </div>
        </div>
        <button 
           onClick={handeSubmitAll} 
           disabled={isLoading}
           className="kinetic-authority-gradient text-white px-6 py-2.5 rounded-md font-bold tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
           <Save size={18} /> {isLoading ? "Menyimpan..." : "Simpan Berkas"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Full Edit Form */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-bold font-headline border-b border-border pb-2 mb-4 text-primary">Informasi Pengiriman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm">Nomor Resi</label>
                <input required type="text" value={receipt.receiptNumber} onChange={e => setReceipt({...receipt, receiptNumber: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border rounded-md" />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="font-bold text-sm">Tanggal</label>
                <Popover>
                  <PopoverTrigger 
                    render={
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal border rounded-md px-4 py-2", !receipt.date && "text-muted-foreground")} />
                    }
                  >
                    {receipt.date ? format(new Date(receipt.date), "PPP") : <span>Pilih Tanggal</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                       mode="single" 
                       selected={receipt.date ? new Date(receipt.date) : undefined} 
                       onSelect={(d) => setReceipt({...receipt, date: d ? d.toISOString() : new Date().toISOString()})} 
                       initialFocus 
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Kota Asal</label>
                <input required type="text" value={receipt.origin} onChange={e => setReceipt({...receipt, origin: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border rounded-md uppercase" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Kota Tujuan</label>
                <input required type="text" value={receipt.destination} onChange={e => setReceipt({...receipt, destination: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border rounded-md uppercase" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-lg font-bold font-headline border-b border-border pb-2 mb-4 text-primary">Detail Paket & Tarif</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <label className="font-bold text-sm">Jml Barang</label>
                <input required type="number" min="1" value={receipt.quantity} onChange={e => setReceipt({...receipt, quantity: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Berat (Kg)</label>
                <input required type="number" min="0" step="any" value={receipt.weight} onChange={e => setReceipt({...receipt, weight: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-md" />
              </div>
               <div className="space-y-2">
                <label className="font-bold text-sm">Berat Volume</label>
                <input required type="number" min="0" step="any" value={receipt.volumeWeight} onChange={e => setReceipt({...receipt, volumeWeight: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Biaya Kirim (Rp)</label>
                <NumericFormat
                  value={receipt.details.shippingCost}
                  onValueChange={(values) => {
                    setReceipt({...receipt, details: {...receipt.details, shippingCost: values.floatValue || 0}});
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp "
                  className="w-full px-4 py-2 border rounded-md text-primary font-bold bg-secondary/10"
                  allowNegative={false}
                  required
                />
              </div>
            </div>
              <div className="space-y-2 col-span-2 md:col-span-2">
                <label className="font-bold text-sm">Nama/Jenis Barang</label>
                <input required type="text" value={receipt.details.itemType} onChange={e => setReceipt({...receipt, details: {...receipt.details, itemType: e.target.value.toUpperCase()}})} className="w-full px-4 py-2 border rounded-md uppercase" />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-headline border-b border-border pb-2 text-primary">Data Pengirim</h3>
              <div className="space-y-2">
                <label className="font-bold text-sm">Nama Lengkap</label>
                <input required type="text" value={receipt.sender.name} onChange={e => setReceipt({...receipt, sender: {...receipt.sender, name: e.target.value.toUpperCase()}})} className="w-full px-4 py-2 border rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">No. Handphone</label>
                <input required type="text" value={receipt.sender.phone} onChange={e => setReceipt({...receipt, sender: {...receipt.sender, phone: e.target.value}})} className="w-full px-4 py-2 border rounded-md" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Email Pengirim</label>
                <input type="email" value={receipt.sender.email || ''} onChange={e => setReceipt({...receipt, sender: {...receipt.sender, email: e.target.value}})} className="w-full px-4 py-2 border rounded-md" placeholder="email@gmail.com" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Alamat Lengkap</label>
                <textarea required rows={3} value={receipt.sender.address} onChange={e => setReceipt({...receipt, sender: {...receipt.sender, address: e.target.value.toUpperCase()}})} className="w-full px-4 py-2 border rounded-md uppercase resize-none"></textarea>
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-headline border-b border-border pb-2 text-primary">Data Penerima</h3>
              <div className="space-y-2">
                <label className="font-bold text-sm">Nama Lengkap</label>
                <input required type="text" value={receipt.receiver.name} onChange={e => setReceipt({...receipt, receiver: {...receipt.receiver, name: e.target.value.toUpperCase()}})} className="w-full px-4 py-2 border rounded-md uppercase" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">No. Handphone</label>
                <input required type="text" value={receipt.receiver.phone} onChange={e => setReceipt({...receipt, receiver: {...receipt.receiver, phone: e.target.value}})} className="w-full px-4 py-2 border rounded-md" placeholder="08..." />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Email (Opsional)</label>
                <input type="email" value={receipt.receiver.email} onChange={e => setReceipt({...receipt, receiver: {...receipt.receiver, email: e.target.value}})} className="w-full px-4 py-2 border rounded-md" placeholder="email@gmail.com" />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Alamat Lengkap</label>
                <textarea required rows={3} value={receipt.receiver.address} onChange={e => setReceipt({...receipt, receiver: {...receipt.receiver, address: e.target.value.toUpperCase()}})} className="w-full px-4 py-2 border rounded-md uppercase resize-none"></textarea>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Timeline Manager */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm sticky top-24">
             <h3 className="text-lg font-bold font-headline border-b border-border pb-2 mb-4 text-primary">Log Status Pengiriman</h3>
             
             {/* Add New Status */}
             <div className="bg-surface p-4 rounded-lg border border-border mb-6 space-y-3">
               <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase">Pembaruan Status</label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v || "SHIPPED")}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">MASIH DIPROSES (PENDING)</SelectItem>
                      <SelectItem value="SHIPPED">SEDANG DIKIRIM (SHIPPED)</SelectItem>
                      <SelectItem value="DELIVERED">TERKIRIM (DELIVERED)</SelectItem>
                      <SelectItem value="FAILED">GAGAL KIRIM (FAILED)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div>
                 <label className="text-xs font-bold text-on-surface-variant uppercase">Keterangan / Deskripsi STATUS</label>
                 <input 
                   type="text" 
                   value={newDescription} 
                   onChange={e => setNewDescription(e.target.value)} 
                   placeholder="Contoh: PAKET TELAH SAMPAI" 
                   className="w-full mt-1 px-3 py-2 text-sm border rounded-md uppercase"
                 />
               </div>
               <div>
                 <label className="text-xs font-bold text-on-surface-variant uppercase">Lokasi</label>
                 <input 
                   type="text" 
                   value={newLocation} 
                   onChange={e => setNewLocation(e.target.value)} 
                   placeholder="Contoh: SEMARANG" 
                   className="w-full mt-1 px-3 py-2 text-sm border rounded-md uppercase"
                 />
               </div>
               <button 
                 onClick={handleAddStatus} 
                 type="button" 
                 className="w-full py-2 bg-on-surface text-white rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors mt-2"
               >
                 <Plus size={16} /> Tambah Log
               </button>
             </div>

             {/* Timeline Preview */}
             <div className="relative pl-6 border-l-2 border-outline-variant mt-2 space-y-6 py-2">
                 {receipt.statusHistory.map((history, idx) => (
                   <div key={idx} className="relative group">
                     <div className={`absolute -left-8.25 w-4 h-4 rounded-full ring-4 ring-white ${idx === 0 ? 'bg-green-500' : 'bg-outline-variant'}`}></div>
                     <div>
                       <p className={`text-xs font-bold ${idx === 0 ? 'text-green-600' : 'text-on-surface-variant'}`}>
                         {new Date(history.timestamp).toLocaleString("id-ID")}
                       </p>
                       <p className="text-on-surface font-bold uppercase text-sm mt-0.5">
                         {getStatusLabel(history.status)}
                       </p>
                       {history.description && (
                         <p className="text-on-surface-variant text-xs mt-0.5">
                           {history.description}
                         </p>
                       )}
                       {history.location && (
                         <p className="text-primary font-bold text-xs mt-0.5 flex items-center gap-1 uppercase">
                           <MapPin size={12} /> {history.location}
                         </p>
                       )}
                     </div>
                   </div>
                 ))}
               </div>

           </div>
        </div>
      </div>

    </div>
  );
}
