"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Plus, Edit, Trash2, Printer, Search, Copy } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PrintTemplate, ReceiptData } from "@/components/resi/PrintTemplate";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
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

export default function ResiManagementPage() {
  const [receipts, setReceipts] = useState<(ReceiptData & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteNumber, setDeleteNumber] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [printData, setPrintData] = useState<ReceiptData | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrintPopup = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Resi-${printData?.receiptNumber || 'JNT'}`,
  });

  const triggerPrint = (receipt: ReceiptData) => {
    setPrintData(receipt);
    setTimeout(() => {
      handlePrintPopup();
    }, 100);
  };

  const fetchReceipts = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "receipts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (ReceiptData & { id: string })[];
      setReceipts(data);
    } catch (error) {
      toast.error("Gagal mengambil data resi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'MASIH DIPROSES (PENDING)';
      case 'SHIPPED': return 'SEDANG DIKIRIM (SHIPPED)';
      case 'DELIVERED': return 'TERKIRIM (DELIVERED)';
      case 'FAILED': return 'GAGAL KIRIM (FAILED)';
      default: return status;
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await deleteDoc(doc(db, "receipts", deleteId));
      toast.success("Resi berhasil dihapus");
      setReceipts(receipts.filter(r => r.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus resi");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReceipts = receipts.filter(r => 
    r.receiptNumber.includes(searchTerm) || 
    r.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.receiver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Manajemen Resi</h1>
          <p className="text-on-surface-variant mt-1">Kelola data pengiriman, update status, dan cetak dokumen resi</p>
        </div>
        <Link 
          href="/dashboard/resi/create"
          className="kinetic-authority-gradient text-white px-6 py-2.5 rounded-md font-bold tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Buat Resi Baru
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-border rounded-xl shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
          <div className="relative w-full max-w-sm flex items-center">
             <Search className="absolute left-3 text-on-surface-variant" size={18} />
             <input 
               type="text" 
               placeholder="Cari No. Resi, Pengirim, Penerima..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
             />
          </div>
          <div className="text-sm font-bold text-on-surface-variant">
            Total Data: {filteredReceipts.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-container-high text-on-surface uppercase font-headline">
              <tr>
                <th className="px-6 py-4 font-black w-48">No. Resi</th>
                <th className="px-6 py-4 font-bold">Tanggal</th>
                <th className="px-6 py-4 font-bold">Pengirim / Asal</th>
                <th className="px-6 py-4 font-bold">Penerima / Tujuan</th>
                <th className="px-6 py-4 font-bold">Status Detail</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant font-bold">
                    Memuat data resi...
                  </td>
                </tr>
              ) : filteredReceipts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                    {searchTerm ? "Tidak ada resi yang cocok dengan pencarian." : "Belum ada data resi."}
                  </td>
                </tr>
              ) : (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-surface transition-colors cursor-default">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(receipt.receiptNumber);
                            toast.success(`No. Resi disalin: ${receipt.receiptNumber}`);
                          }
                        }}
                        className="font-black text-primary hover:text-primary/80 transition-colors bg-transparent border-none p-0 cursor-pointer text-left flex items-center gap-2 group/copy"
                        title="Klik untuk menyalin"
                      >
                        {receipt.receiptNumber}
                        <Copy size={14} className="opacity-0 group-hover/copy:opacity-100 transition-opacity text-on-surface-variant" />
                      </button>
                    </td>
                    <td className="px-6 py-4 font-inter">
                      {new Date(receipt.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface truncate max-w-[150px] uppercase">{receipt.sender.name}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{receipt.origin}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface truncate max-w-[150px] uppercase">{receipt.receiver.name}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{receipt.destination}</div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                         ${receipt.currentStatus === 'DELIVERED' || receipt.currentStatus === 'TERKIRIM' ? 'bg-green-100 text-green-700 border-green-200' : 
                           receipt.currentStatus === 'FAILED' ? 'bg-red-100 text-red-700 border-red-200' :
                           receipt.currentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                           'bg-blue-50 text-blue-700 border-blue-200'}
                       `}>
                         {getStatusLabel(receipt.currentStatus)}
                       </span>
                       <div className="text-xs text-on-surface-variant mt-1.5 truncate max-w-[200px]">
                         Lokasi: {receipt.statusHistory[0]?.location || '-'}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link 
                          href={`/dashboard/resi/${receipt.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit & Update Status"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => triggerPrint(receipt)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Cetak Resi"
                        >
                          <Printer size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteId(receipt.id);
                            setDeleteNumber(receipt.receiptNumber);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="hidden">
        <PrintTemplate ref={componentRef} data={printData} />
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Resi {deleteNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Resi yang sudah dihapus tidak dapat dipulihkan kembali dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus Resi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
