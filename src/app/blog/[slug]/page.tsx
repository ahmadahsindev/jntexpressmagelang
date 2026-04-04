import type { Metadata } from "next";
import BlogDetailContent from "./_components/BlogDetailContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Artikel Blog",
  description:
    "Baca artikel informatif dari J&T Express Magelang seputar pengiriman, ekspedisi, tips kirim paket, dan layanan kurir di Magelang.",
  openGraph: {
    type: "article",
    locale: "id_ID",
    siteName: "J&T Express Magelang",
  },
};

export default function BlogDetailPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: "Artikel", url: "/blog" },
        ]}
      />
      <BlogDetailContent />
    </>
  );
}
