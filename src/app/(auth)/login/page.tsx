"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low p-6">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8 tonal-shift-bottom">
        <div className="text-center mb-8">
          <h1 className="font-headline font-black text-3xl text-primary tracking-tight mb-2">J&T Admin</h1>
          <p className="text-on-surface-variant text-sm">Masuk ke dashboard manajemen resi</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface" htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              className="w-full px-4 py-3 rounded-md bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-colors text-sm"
              placeholder="admin@jntexpressmagelang.com"
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-sm font-bold text-on-surface" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                className="w-full px-4 py-3 rounded-md bg-surface-container-low border-transparent focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary transition-colors text-sm pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full kinetic-authority-gradient text-white py-3 rounded-md font-bold tracking-wide uppercase hover:opacity-90 transition-opacity">
            Masuk
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Belum punya akses? <Link href="/signup" className="text-primary font-bold hover:underline">Daftar Admin</Link>
        </div>
      </div>
    </div>
  );
}
