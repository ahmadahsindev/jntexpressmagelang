import type { Metadata } from "next";
import { Inter, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J&T Express Magelang - Kirim Cepat, Aman, Terpercaya",
  description: "Company profile dinamis dan manajemen resi J&T Express area Magelang.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} h-full flex flex-col font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
