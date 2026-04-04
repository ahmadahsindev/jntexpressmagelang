import type { Metadata } from "next";
import HomeContent from "./_components/HomeContent";
import {
  LocalBusinessJsonLd,
  WebSiteJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: {
    absolute:
      "J&T Express Magelang - Jasa Pengiriman & Ekspedisi Cepat Magelang",
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
    "jnt express magelang kota magelang jawa tengah",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      <BreadcrumbJsonLd
        items={[{ name: "Beranda", url: "https://jntexpressmagelang.com" }]}
      />
      <HomeContent />
    </>
  );
}
