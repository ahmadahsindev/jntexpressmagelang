import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
        <div className="-mt-16">
          <h2 className="text-4xl font-black font-headline text-on-surface mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-on-surface-variant max-w-md mx-auto mb-10 text-lg">
            Maaf, halaman yang Anda cari mungkin telah dihapus, berganti nama, atau sedang tidak tersedia untuk sementara waktu.
          </p>
          <Link 
            href="/" 
            className="kinetic-authority-gradient text-white px-8 py-4 rounded-md font-bold tracking-wide shadow-xl inline-flex items-center gap-2 uppercase hover:opacity-90 transition-opacity"
          >
            <MoveLeft size={20} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
