"use client";

import {
  FileText,
  Home,
  Image as ImageIcon,
  Info,
  LayoutDashboard,
  LogOut,
  Package,
  Star,
  Phone
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const cmsNav = [
    { name: "Resi Pengiriman", href: "/dashboard/cms/receipts", icon: Package },
    { name: "Home Page", href: "/dashboard/cms/home", icon: Home },
    { name: "Tentang Kami", href: "/dashboard/cms/about", icon: Info },
    { name: "Layanan", href: "/dashboard/cms/services", icon: Package },
    { name: "Keunggulan", href: "/dashboard/cms/features", icon: Star },
    { name: "Galeri", href: "/dashboard/cms/gallery", icon: ImageIcon },
    { name: "Blog", href: "/dashboard/cms/blog", icon: FileText },
    { name: "Kontak", href: "/dashboard/cms/contact", icon: Phone },
  ];

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="p-4 group-data-[state=expanded]:p-8">
        <div className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white overflow-hidden shadow-lg transition-transform hover:scale-105 active:scale-95">
             <img 
               src="/logo/jnt-logo.jpg" 
               alt="Logo" 
               className="size-full object-cover"
             />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-black font-headline text-xl tracking-tight uppercase text-white">J&T Express</span>
            <span className="text-[11px] font-bold opacity-80 uppercase tracking-[0.2em] -mt-0.5 text-white">Magelang</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 group-data-[state=expanded]:px-4">
        <SidebarGroup>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-white/40 px-2 text-[10px] uppercase font-black tracking-widest mb-2">Utama</SidebarGroupLabel>
          </div>
          <SidebarMenu className="gap-1.5">
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className={`
                    flex items-center gap-3 px-3 py-6 rounded-xl transition-all duration-200
                    hover:bg-white/10 hover:translate-x-1
                    data-[active=true]:bg-white data-[active=true]:text-primary data-[active=true]:shadow-lg
                  `}
                >
                  <item.icon className="size-5" />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-white/40 px-2 text-[10px] uppercase font-black tracking-widest mb-2">Konten Web (CMS)</SidebarGroupLabel>
          </div>
          <SidebarMenu className="gap-1.5">
            {cmsNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  render={<Link href={item.href} />}
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.name}
                  className={`
                    flex items-center gap-3 px-3 py-6 rounded-xl transition-all duration-200
                    hover:bg-white/10 hover:translate-x-1
                    data-[active=true]:bg-white data-[active=true]:text-primary data-[active=true]:shadow-lg
                  `}
                >
                  <item.icon className="size-5" />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[state=expanded]:p-6">
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton 
               render={<Link href="/" />}
               tooltip="Keluar Panel"
               className="flex items-center gap-3 px-3 py-6 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
             >
               <LogOut className="size-5 rotate-180" />
               <span className="font-bold text-sm uppercase tracking-wider">Keluar</span>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="hover:after:bg-white/20" />
    </Sidebar>
  );
}
