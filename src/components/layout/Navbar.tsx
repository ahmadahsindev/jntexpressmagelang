"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const getLinkClass = (path: string, isExact: boolean = true) => {
    const isActive = isExact ? pathname === path : pathname.startsWith(path);
    return isActive
      ? "text-primary border-b-2 border-primary md:border-b-2 md:pb-1 font-headline text-sm font-bold tracking-tight transition-colors duration-300"
      : "text-slate-700 dark:text-slate-300 font-headline text-sm font-bold tracking-tight hover:text-primary transition-colors duration-300";
  };

  const mobileLinks = [
    { name: "HOME", href: "/" },
    { name: "CEK RESI", href: "/cek-resi" },
    { name: "TENTANG KAMI", href: "/about" },
    { name: "LAYANAN", href: "/services" },
    { name: "KEUNGGULAN", href: "/features" },
    { name: "GALERI", href: "/gallery" },
    { name: "BLOG", href: "/blog" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-border/10">
      <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 shrink-0 z-50">
          <img 
            src="/logo/jnt-logo.jpg" 
            alt="J&T Express Logo" 
            className="h-8 md:h-10 w-auto object-contain"
          />
          <div className="flex flex-col leading-none">
            <span className="text-lg md:text-xl font-black text-primary tracking-tighter uppercase line-clamp-1">J&T Express <span className="hidden sm:inline">Magelang</span></span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link href="/" className={getLinkClass("/")}>HOME</Link>
          <Link href="/cek-resi" className={getLinkClass("/cek-resi")}>CEK RESI</Link>
          <Link href="/about" className={getLinkClass("/about")}>TENTANG KAMI</Link>
          <Link href="/services" className={getLinkClass("/services")}>LAYANAN</Link>
          <Link href="/features" className={getLinkClass("/features")}>KEUNGGULAN</Link>
          <Link href="/gallery" className={getLinkClass("/gallery")}>GALERI</Link>
          <Link href="/blog" className={getLinkClass("/blog", false)}>BLOG</Link>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/cek-resi" className="hidden sm:inline-flex bg-primary text-background px-5 py-2 rounded-md font-bold text-xs md:text-sm tracking-tight hover:scale-95 active:opacity-80 transition-transform uppercase">
            LACAK PAKET
          </Link>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-50"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-white dark:bg-slate-900 z-40 lg:hidden flex flex-col pt-24 px-6 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "opacity-100 visible translate-x-0" : "opacity-0 invisible translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-6">
            {mobileLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-2xl font-black font-headline tracking-tighter uppercase transition-colors ${
                  pathname === link.href ? "text-primary" : "text-slate-700 dark:text-slate-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-border">
              <Link 
                href="/cek-resi" 
                className="w-full bg-primary text-background px-6 py-4 rounded-xl font-black text-center text-lg tracking-tight hover:scale-95 active:opacity-90 transition-transform uppercase block"
                onClick={() => setIsMenuOpen(false)}
              >
                LACAK PAKET SEKARANG
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
