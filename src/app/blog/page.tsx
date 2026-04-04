import type { Metadata } from "next";
import BlogListContent from "./_components/BlogListContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Blog & Informasi",
  description:
    "Blog dan informasi terbaru dari J&T Express Magelang. Tips pengiriman, promo, berita terkini tentang jasa ekspedisi dan pengiriman paket di Magelang.",
  keywords: [
    "blog jnt express magelang",
    "berita jnt magelang",
    "informasi pengiriman magelang",
    "tips kirim paket magelang",
    "promo jnt magelang",
  ],
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Blog", url: "/blog" },
        ]}
      />
      <BlogListContent />
    </>
  );
}
