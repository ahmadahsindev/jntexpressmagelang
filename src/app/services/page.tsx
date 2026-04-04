import type { Metadata } from "next";
import ServicesContent from "./_components/ServicesContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Layanan Pengiriman",
  description:
    "Daftar layanan pengiriman J&T Express Magelang: JNT EZ, JNT Eco, Express, dan lainnya. Solusi pengiriman paket cepat, aman, dan murah di Magelang ke seluruh Indonesia.",
  keywords: [
    "layanan jnt express magelang",
    "jasa pengiriman magelang",
    "tarif jnt magelang",
    "ongkir jnt magelang",
    "paket jnt express magelang",
    "jnt eco magelang",
    "jnt ez magelang",
  ],
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Layanan", url: "/services" },
        ]}
      />
      <ServicesContent />
    </>
  );
}
