import type { Metadata } from "next";
import CekResiClientPage from "./_components/CekResiContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Cek Resi & Lacak Paket",
  description:
    "Cek resi dan lacak paket J&T Express Magelang secara online. Masukkan nomor resi untuk melihat status pengiriman paket Anda secara real-time. Pelacakan cepat dan akurat.",
  keywords: [
    "cek resi jnt magelang",
    "lacak paket jnt magelang",
    "tracking jnt magelang",
    "resi jnt express magelang",
    "cek pengiriman jnt magelang",
    "lacak kiriman magelang",
    "cek resi jnt express",
    "no resi jnt magelang",
  ],
  alternates: {
    canonical: "/cek-resi",
  },
};

export default function CekResiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Cek Resi", url: "/cek-resi" },
        ]}
      />
      <CekResiClientPage />
    </>
  );
}
