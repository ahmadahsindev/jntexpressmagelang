"use client";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-primary font-black font-headline text-lg animate-pulse">
        Menyiapkan Data...
      </p>
    </div>
  );
}
