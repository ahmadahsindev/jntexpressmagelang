"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface ResiSearchFormProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
}

export function ResiSearchForm({ initialValue = "", onSearch, isLoading = false }: ResiSearchFormProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const router = useRouter();

  useEffect(() => {
    if (initialValue) setSearchQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/cek-resi?q=${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto flex items-center">
      <div className="absolute left-4 text-primary">
        <Search size={24} />
      </div>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
        placeholder="Contoh: 37844537344611"
        className="w-full pl-14 pr-28 md:pr-32 py-4 md:py-5 rounded-lg text-black font-bold text-sm md:text-lg bg-surface border-2 border-border focus:border-primary shadow-2xl transition-all outline-none truncate"
        required
      />
      <button 
        type="submit"
        disabled={isLoading}
        className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-red-800 text-white px-4 md:px-8 rounded-md font-bold transition-colors disabled:opacity-50"
      >
        {isLoading ? "Mencari..." : "Lacak"}
      </button>
    </form>
  );
}
