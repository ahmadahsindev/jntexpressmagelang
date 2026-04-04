import type { Metadata } from "next";
import FeaturesClientContent from "./_components/FeaturesContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Keunggulan Kami",
  description:
    "Keunggulan J&T Express Magelang: pengiriman cepat, aman, terpercaya, dengan harga bersaing. Alasan memilih J&T Express sebagai partner pengiriman paket di Magelang.",
  keywords: [
    "keunggulan jnt express magelang",
    "kelebihan jnt magelang",
    "kenapa pilih jnt magelang",
    "jnt express magelang terpercaya",
    "pengiriman cepat magelang",
  ],
  alternates: {
    canonical: "/features",
  },
};

export default function FeaturesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Keunggulan", url: "/features" },
        ]}
      />
      <FeaturesClientContent />
    </>
  );
}
