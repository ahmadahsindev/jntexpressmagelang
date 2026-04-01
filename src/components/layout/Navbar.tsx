"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm dark:shadow-none tonal-shift-bottom">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo/jnt-logo.jpg" 
            alt="J&T Express Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-primary tracking-tighter">J&T Express Magelang</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-primary border-b-2 border-primary font-headline text-sm font-bold tracking-tight hover:text-primary-container transition-colors duration-300">HOME</Link>
          <Link href="#about" className="text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300">TENTANG KAMI</Link>
          <Link href="#services" className="text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300">LAYANAN</Link>
          <Link href="#features" className="text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300">KEUNGGULAN</Link>
          <Link href="#gallery" className="text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300">GALERI</Link>
          <Link href="#blog" className="text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300">BLOG</Link>
          <Link href="#contact" className="text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300">KONTAK</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-primary hidden md:block">Admin Login</Link>
          <button className="bg-primary text-background px-6 py-2.5 rounded-md font-bold text-sm tracking-tight scale-95 active:opacity-80 transition-transform uppercase">
            CEK RESI
          </button>
        </div>
      </nav>
    </header>
  );
}
