"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, LogOut, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Resi", href: "/dashboard/receipts", icon: Package },
    { name: "Pengaturan CMS", href: "/dashboard/cms", icon: Settings },
  ];

  return (
    <div className="flex bg-surface-container-low min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-border h-screen sticky top-0 flex flex-col tonal-shift-bottom">
        <div className="p-6">
          <h2 className="text-2xl font-black font-headline text-primary tracking-tight">J&T Admin</h2>
          <p className="text-xs text-on-surface-variant mt-1">Magelang Control Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <Link href="/">
            <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-bold text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut size={18} />
              Keluar
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
