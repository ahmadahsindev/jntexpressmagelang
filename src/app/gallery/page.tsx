import type { Metadata } from "next";
import GalleryContent from "./_components/GalleryContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Galeri Dokumentasi",
  description:
    "Galeri foto dan dokumentasi kegiatan J&T Express Magelang. Lihat aktivitas operasional pengiriman paket, kegiatan tim, dan layanan ekspedisi kami di Magelang.",
  keywords: [
    "galeri jnt express magelang",
    "foto jnt magelang",
    "dokumentasi jnt magelang",
    "kegiatan jnt express magelang",
  ],
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Galeri", url: "/gallery" },
        ]}
      />
      <GalleryContent />
    </>
  );
}
