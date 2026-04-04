"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, MapPin, ArrowUp } from "lucide-react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

interface ContactsData {
  address: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  location: string;
}

export function Footer() {
  const [contacts, setContacts] = useState<ContactsData | null>(null);

  useEffect(() => {
    async function loadContacts() {
      try {
        const snap = await getDoc(doc(db, "content", "contacts"));
        if (snap.exists()) {
          setContacts(snap.data() as ContactsData);
        }
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      }
    }
    loadContacts();
  }, []);

  return (
    <footer className="bg-red-700 dark:bg-red-900 w-full py-12 px-6 flex flex-col items-center text-center gap-6 mt-auto">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-left text-white">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img 
              src="/logo/jnt-logo.jpg" 
              alt="J&T Express Logo" 
              className="h-10 w-auto object-contain rounded-md"
            />
            <h3 className="text-xl font-bold text-white font-headline tracking-tighter">J&T Express Magelang</h3>
          </div>
          {/* <p className="text-white/80 font-inter font-light leading-relaxed text-sm">
            Menghubungkan Magelang dengan seluruh penjuru Nusantara melalui layanan ekspedisi kelas dunia.
          </p> */}
          <div className="mt-8 flex gap-4">
            {contacts?.facebook && (
               <a href={contacts.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all" title="Facebook">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                 </svg>
               </a>
            )}
            {contacts?.instagram && (
               <a href={contacts.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all" title="Instagram">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                   <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                   <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                 </svg>
               </a>
            )}
            {contacts?.email && (
               <a href={`mailto:${contacts.email}`} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all" title="Email">
                 <Mail size={16} />
               </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 font-headline">Kontak Terpusat</h4>
          {contacts ? (
            <div className="text-white/80 font-inter font-light leading-relaxed mb-4 text-sm space-y-2">
              {contacts.address && (
                <p><strong>Alamat:</strong> {contacts.address}</p>
              )}
              {contacts.phone && (
                <p><strong>Phone:</strong> {contacts.phone}</p>
              )}
              {contacts.email && (
                <p><strong>Email:</strong> {contacts.email}</p>
              )}
            </div>
          ) : (
             <div className="text-white/80 font-inter font-light leading-relaxed mb-4 text-sm space-y-2">
               Memuat informasi kontak...
             </div>
          )}
        </div>

        <div className="flex flex-col h-full">
          <h4 className="text-lg font-bold mb-6 font-headline">Lokasi Kami</h4>
          <div className="flex-1 w-full bg-surface-container rounded-xl overflow-hidden border border-white/10 min-h-[200px]">
             {contacts?.location ? (
               <iframe 
                 src={contacts.location.includes('<iframe') ? (contacts.location.match(/src="([^"]+)"/) || [])[1] || contacts.location : contacts.location} 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, minHeight: '200px' }} 
                 allowFullScreen={true} 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-sm text-white/50 p-4 font-inter text-center">
                  Peta lokasi belum ditambahkan
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-white/60 text-sm">
        <p>© {new Date().getFullYear()} J&T Express Magelang. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
