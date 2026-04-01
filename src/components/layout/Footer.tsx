"use client";

import Link from "next/link";
import { Share2, Mail, MapPin, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-red-700 dark:bg-red-900 w-full py-12 px-6 flex flex-col items-center text-center gap-6 mt-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-left text-white">
        <div>
          <h3 className="text-xl font-bold text-white mb-6 font-headline tracking-tighter">J&T Express Magelang</h3>
          <p className="text-white/80 font-inter font-light leading-relaxed text-sm">
            Menghubungkan Magelang dengan seluruh penjuru Nusantara melalui layanan ekspedisi kelas dunia.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <Share2 size={16} />
            </button>
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <Mail size={16} />
            </button>
            <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <MapPin size={16} />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline">Kantor Pusat</h4>
          <p className="text-white/80 font-inter font-light leading-relaxed mb-4 text-sm">
            Jl. Pajajaran No.1C, Kemirirejo, Kec. Magelang Tengah, Kota Magelang, Jawa Tengah 56122,<br />Jawa Tengah 56123
          </p>
          {/* <h4 className="text-lg font-bold mb-4 font-headline">Drop Point Mertoyudan</h4>
          <p className="text-white/80 font-inter font-light leading-relaxed text-sm">
            Jl. Mayjen Bambang Soegeng,<br />Mertoyudan, Kabupaten Magelang
          </p> */}
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline">Navigasi Cepat</h4>
          <div className="flex flex-col gap-3 text-sm">
            <Link href="#contact" className="text-white/80 hover:text-white transition-opacity font-bold">Hubungi Kami</Link>
            <Link href="#locations" className="text-white/80 hover:text-white transition-opacity">Lokasi Drop Point</Link>
            <Link href="#terms" className="text-white/80 hover:text-white transition-opacity">Syarat & Ketentuan</Link>
            <Link href="#faq" className="text-white/80 hover:text-white transition-opacity">FAQ</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-white/60 text-sm">
        <p>© 2026 J&T Express Magelang. All Rights Reserved.</p>
        <button onClick={scrollToTop} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all group mt-4 md:mt-0">
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform text-white" />
        </button>
      </div>
    </footer>
  );
}
