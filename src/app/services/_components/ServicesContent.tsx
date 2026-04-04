"use client";

import { useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PublicHero } from "@/components/layout/PublicHero";
import { db } from "@/lib/firebase/config";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";

interface ServicePageSettings {
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
}

export default function ServicesContent() {
  const [settings, setSettings] = useState<ServicePageSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch independently so one failure doesn't break the other
      try {
        const settingsSnap = await getDoc(doc(db, "content", "services_page"));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as ServicePageSettings);
        }
      } catch (err) {
        console.error("Failed to fetch services page settings", err);
      }

      try {
        const servicesSnap = await getDocs(query(collection(db, "services")));
        const fetchedServices = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem));
        setServices(fetchedServices);
      } catch (err) {
        console.error("Failed to fetch services list", err);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <div className="pt-20 md:pt-28 pb-16 min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </PublicLayout>
    );
  }

  const hasServices = services.length > 0;

  return (
    <PublicLayout>
      {/* Hero Banner Section (Full Width) via Shared Component */}
      <PublicHero 
        bannerUrl={settings?.bannerUrl}
        bannerTitle={settings?.bannerTitle}
        bannerSubtitle={settings?.bannerSubtitle}
        fallbackTitle="Layanan Kami"
      />

      {/* Main Content Area */}
      <div className="pt-16 pb-24 bg-[#f2f7fc]">
        <div className="max-w-7xl mx-auto px-6">
          {!hasServices ? (
            <div className="text-center py-20 text-[#6b7280] italic">
              Layanan sedang diperbarui.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 relative z-20">
              {services.map(service => (
                <div key={service.id} className="flex flex-col items-center bg-transparent group">
                  <div className="w-full aspect-square bg-[#e2e8f0] mb-6 overflow-hidden">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-headline text-[#1f2937] text-center mb-3">
                    {service.title}
                  </h3>
                  <div 
                    className="text-[#4b5563] text-center text-sm md:text-base font-inter prose prose-p:leading-relaxed prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ __html: service.content }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
