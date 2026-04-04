import React from 'react';

interface PublicHeroProps {
  bannerUrl?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  fallbackTitle: string; // Used if bannerUrl is missing
}

export function PublicHero({ bannerUrl, bannerTitle, bannerSubtitle, fallbackTitle }: PublicHeroProps) {
  // If we have a banner image, render the full hero
  if (bannerUrl) {
    return (
      <section className="relative h-[50vh] min-h-100 max-h-150 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={bannerUrl} 
            alt={bannerTitle || fallbackTitle} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          {bannerTitle && (
            <h1 className="font-headline font-black text-4xl md:text-5xl lg:text-6xl text-white mb-6 tracking-tight uppercase">
              {bannerTitle}
            </h1>
          )}
          {bannerSubtitle && (
            <p className="text-lg md:text-xl font-inter text-white/90 max-w-3xl mx-auto">
              {bannerSubtitle}
            </p>
          )}
        </div>
      </section>
    );
  }

  // If no banner image, just render the text directly matching the page background
  return (
    <div className="text-center mb-16 pt-10">
      <h1 className="text-4xl md:text-5xl font-black font-headline text-primary uppercase tracking-tight">
        {bannerTitle || fallbackTitle}
      </h1>
      {bannerSubtitle && (
        <p className="text-on-surface-variant mt-4 font-inter text-lg">{bannerSubtitle}</p>
      )}
      <div className="w-24 h-1.5 bg-primary mx-auto mt-6 rounded-full"></div>
    </div>
  );
}
