"use client";

import { useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Save, ArrowLeft, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateResiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [receiptNumber, setReceiptNumber] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState("MAGELANG");
  const [destination, setDestination] = useState("");
  
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState(1);
  const [volumeWeight, setVolumeWeight] = useState(1);
  
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  const [itemType, setItemType] = useState("");
  const [shippingCost, setShippingCost] = useState<number | undefined>(0);

  // Initial Status State
  const [newStatus, setNewStatus] = useState("PENDING");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("MAGELANG");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Silakan pilih tanggal");
      return;
    }
    if (!newStatus || !newDescription || !newLocation) {
      toast.error("Status, Deskripsi, dan Lokasi AWAL harus diisi");
      return;
    }
    setIsLoading(true);
    
    // Initial status
    const initialStatusObj = {
      status: newStatus.toUpperCase(),
      description: newDescription.toUpperCase(),
      timestamp: date.toISOString(),
      location: newLocation.toUpperCase()
    };

    try {
      await addDoc(collection(db, "receipts"), {
        receiptNumber: receiptNumber.toUpperCase(),
        date: date.toISOString(),
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        quantity,
        weight,
        volumeWeight,
        sender: {
          name: senderName.toUpperCase(),
          phone: senderPhone,
          email: senderEmail,
          address: senderAddress.toUpperCase()
        },
        receiver: {
          name: receiverName.toUpperCase(),
          phone: receiverPhone,
          email: receiverEmail,
          address: receiverAddress.toUpperCase()
        },
        details: {
          itemType: itemType.toUpperCase(),
          shippingCost: shippingCost || 0
        },
        statusHistory: [initialStatusObj],
        currentStatus: initialStatusObj.status,
        createdAt: date.toISOString()
      });
      
      toast.success("Resi baru berhasil dibuat!");
      router.push("/dashboard/resi");
    } catch (error) {
      toast.error("Gagal membuat resi baru");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 min-h-screen">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/resi" className="p-2 hover:bg-surface-container rounded-md transition-colors">
            <ArrowLeft size={24} className="text-on-surface" />
          </Link>
          <div>
            <h1 className="text-3xl font-black font-headline text-on-surface">Buat Resi Baru</h1>
            <p className="text-on-surface-variant mt-1">Input data pengiriman paket secara manual</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Info Utama */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-bold font-headline border-b border-border pb-2 mb-4 text-primary">Informasi Pengiriman</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-sm">Nomor Resi</label>
              <input required type="text" value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" placeholder="Contoh: 37844537344611" />
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="font-bold text-sm">Tanggal Diterima</label>
              <Popover>
                <PopoverTrigger 
                  render={
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal border rounded-md px-4 py-2", !date && "text-muted-foreground")} />
                  }
                >
                  {date ? format(date, "PPP") : <span>Pilih Tanggal</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Kota Asal</label>
              <input required type="text" value={origin} onChange={e => setOrigin(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" />
            </div>
             <div className="space-y-2">
              <label className="font-bold text-sm">Lokasi Drop Point (Awal)</label>
              <input required type="text" value={newLocation} onChange={e => setNewLocation(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Kota Tujuan</label>
              <input required type="text" value={destination} onChange={e => setDestination(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" placeholder="CONTOH: SEMARANG" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Status Awal untuk Pelacakan</label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v || "PENDING")}>
                <SelectTrigger className="w-full">
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
            <div className="space-y-2">
              <label className="font-bold text-sm">Keterangan / Deskripsi untuk Status Pengiriman</label>
              <input placeholder="CONTOH: PAKET SEDANG DIKIRIM" required type="text" value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" />
            </div>
          </div>
        </div>

        {/* Info Barang & Tarif */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-bold font-headline border-b border-border pb-2 mb-4 text-primary">Detail Paket & Tarif</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-sm">Jml Barang</label>
              <input required type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Berat (Kg)</label>
              <input required type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Berat Volume</label>
              <input required type="number" min="0.1" step="0.1" value={volumeWeight} onChange={e => setVolumeWeight(Number(e.target.value))} className="w-full px-4 py-2 border rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Biaya Kirim (Rp)</label>
              <NumericFormat
                value={shippingCost}
                onValueChange={(values) => {
                  setShippingCost(values.floatValue || 0);
                }}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                className="w-full px-4 py-2 border rounded-md text-primary font-bold bg-secondary/10 outline-none"
                allowNegative={false}
                required
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-4">
              <label className="font-bold text-sm">Nama/Jenis Barang</label>
              <input required type="text" value={itemType} onChange={e => setItemType(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" placeholder="Contoh: Pakaian, HP iPhone..." />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Data Pengirim */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-headline border-b border-border pb-2 text-primary">Data Pengirim</h3>
            <div className="space-y-2">
              <label className="font-bold text-sm">Nama Lengkap</label>
              <input required type="text" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-bold text-sm">No. Handphone</label>
                <input required type="text" value={senderPhone} onChange={e => setSenderPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md" placeholder="08..." />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Email (Opsional)</label>
                <input type="email" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Alamat Lengkap</label>
              <textarea required rows={3} value={senderAddress} onChange={e => setSenderAddress(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase resize-none"></textarea>
            </div>
          </div>

          {/* Data Penerima */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold font-headline border-b border-border pb-2 text-primary">Data Penerima</h3>
            <div className="space-y-2">
              <label className="font-bold text-sm">Nama Lengkap</label>
              <input required type="text" value={receiverName} onChange={e => setReceiverName(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-bold text-sm">No. Handphone</label>
                <input required type="text" value={receiverPhone} onChange={e => setReceiverPhone(e.target.value)} className="w-full px-4 py-2 border rounded-md" placeholder="08..." />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm">Email (Opsional)</label>
                <input type="email" value={receiverEmail} onChange={e => setReceiverEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm">Alamat Lengkap</label>
              <textarea required rows={3} value={receiverAddress} onChange={e => setReceiverAddress(e.target.value)} className="w-full px-4 py-2 border rounded-md uppercase resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end border-t border-border pt-6 pb-10">
          <button 
            type="submit" 
            disabled={isLoading}
            className="kinetic-authority-gradient text-white px-10 py-3 rounded-md font-bold tracking-wide shadow-lg flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={20} />
            {isLoading ? "Menyimpan Resi..." : "Simpan & Buat Resi"}
          </button>
        </div>
      </form>
    </div>
  );
}
