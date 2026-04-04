import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { RouteChangeWatcher } from "@/components/utils/RouteChangeWatcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jntexpressmagelang.com"),
  title: {
    template: "%s | J&T Express Magelang",
    default: "J&T Express Magelang - Jasa Pengiriman & Ekspedisi Cepat Magelang",
  },
  description:
    "J&T Express Magelang - Layanan jasa pengiriman dan ekspedisi paket cepat, aman, terpercaya di area Magelang dan seluruh Indonesia. Cek resi, lacak paket, dan info lengkap layanan J&T Express cabang Magelang.",
  keywords: [
    "jnt express magelang",
    "jnt magelang",
    "j&t express magelang",
    "j&t magelang",
    "jnt magelang kota",
    "ekspedisi magelang",
    "pengiriman paket magelang",
    "kurir magelang",
    "jasa kirim magelang",
    "jasa pengiriman magelang",
    "cek resi jnt magelang",
    "lacak paket magelang",
    "ongkir magelang",
    "cargo magelang",
    "kirim paket magelang",
  ],
  applicationName: "J&T Express Magelang",
  authors: [{ name: "J&T Express Magelang" }],
  creator: "J&T Express Magelang",
  publisher: "J&T Express Magelang",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jntexpressmagelang.com",
    siteName: "J&T Express Magelang",
    title: "J&T Express Magelang - Jasa Pengiriman & Ekspedisi Cepat Magelang",
    description:
      "Layanan jasa pengiriman dan ekspedisi paket cepat, aman, terpercaya di area Magelang dan seluruh Indonesia. Cek resi & lacak paket J&T Express Magelang.",
    images: [
      {
        url: "/logo/jnt-logo.jpg",
        width: 800,
        height: 600,
        alt: "J&T Express Magelang Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "J&T Express Magelang - Jasa Pengiriman & Ekspedisi Cepat",
    description:
      "Layanan pengiriman paket cepat, aman, terpercaya di Magelang. Cek resi & lacak paket online.",
    images: ["/logo/jnt-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://jntexpressmagelang.com",
  },
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE", // Add after Google Search Console setup
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="min-h-screen scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} min-h-screen flex flex-col font-sans antialiased`} suppressHydrationWarning>
        <RouteChangeWatcher>
          {children}
        </RouteChangeWatcher>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
