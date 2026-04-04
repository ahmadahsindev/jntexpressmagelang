import type { Metadata } from "next";
import AboutContent from "./_components/AboutContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Tentang Kami - Profil J&T Express Magelang",
  description:
    "Profil lengkap J&T Express Magelang. Sejarah, visi misi, dan nilai-nilai perusahaan. Melayani pengiriman paket cepat dan aman di area Magelang dan seluruh Indonesia.",
  keywords: [
    "tentang jnt express magelang",
    "profil jnt magelang",
    "sejarah jnt magelang",
    "visi misi jnt express magelang",
    "jnt express cabang magelang",
  ],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Tentang Kami", url: "/about" },
        ]}
      />
      <AboutContent />
    </>
  );
}
