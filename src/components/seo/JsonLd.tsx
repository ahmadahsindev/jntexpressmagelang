/**
 * JSON-LD Structured Data Components for SEO
 * These are Server Components that render <script> tags with structured data
 * for Google rich results and knowledge panels.
 */

const BASE_URL = "https://jntexpressmagelang.com";

/** LocalBusiness + Organization schema for the homepage */
export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "J&T Express Magelang",
    alternateName: ["JNT Express Magelang", "JNT Magelang", "J&T Magelang"],
    url: BASE_URL,
    description:
      "Layanan jasa pengiriman dan ekspedisi paket cepat, aman, terpercaya di area Magelang dan seluruh Indonesia.",
    image: `${BASE_URL}/logo/jnt-logo.jpg`,
    logo: `${BASE_URL}/logo/jnt-logo.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Magelang",
      addressRegion: "Jawa Tengah",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.4797,
      longitude: 110.2177,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Magelang",
      },
      {
        "@type": "AdministrativeArea",
        name: "Kabupaten Magelang",
      },
    ],
    parentOrganization: {
      "@type": "Organization",
      name: "J&T Express",
      url: "https://www.jet.co.id",
    },
    sameAs: [],
    priceRange: "$$",
    serviceType: [
      "Jasa Pengiriman Paket",
      "Ekspedisi",
      "Kurir",
      "Cargo",
      "Logistik",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** WebSite schema with SearchAction for sitelinks search box */
export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "J&T Express Magelang",
    alternateName: "JNT Express Magelang",
    url: BASE_URL,
    description:
      "Website resmi J&T Express Magelang. Cek resi, lacak paket, dan informasi layanan pengiriman.",
    publisher: {
      "@type": "Organization",
      name: "J&T Express Magelang",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo/jnt-logo.jpg`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/cek-resi?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/** BreadcrumbList schema */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
