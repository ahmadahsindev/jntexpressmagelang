import Link from "next/link";
import { AlertCircle, MoveLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center bg-surface-container-low rounded-3xl m-4 border border-dashed border-outline-variant">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <AlertCircle size={64} className="text-primary" />
      </div>
      <h1 className="text-3xl font-black font-headline text-on-surface mb-3">Menu Admin Tidak Ditemukan</h1>
      <p className="text-on-surface-variant max-w-sm mx-auto mb-8 font-medium">
        Halaman dashboard yang Anda akses tidak tersedia atau Anda tidak memiliki izin untuk fitur ini.
      </p>
      <Link 
        href="/dashboard" 
        className="kinetic-authority-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <MoveLeft size={18} /> Ke Dashboard Utama
      </Link>
    </div>
  );
}
