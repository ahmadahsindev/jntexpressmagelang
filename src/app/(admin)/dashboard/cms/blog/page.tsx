"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Plus, Edit, Trash2, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  content: string;
  publishedAt: string;
}

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("publishedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogData[];
      setBlogs(data);
    } catch (error) {
      toast.error("Gagal mengambil data blog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      await deleteDoc(doc(db, "blogs", deleteId));
      toast.success("Blog berhasil dihapus");
      setBlogs(blogs.filter(b => b.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Manajemen Blog</h1>
          <p className="text-on-surface-variant mt-1">Kelola artikel, berita, dan informasi publik perusahaan</p>
        </div>
        <Link 
          href="/dashboard/cms/blog/create"
          className="kinetic-authority-gradient text-white px-6 py-2.5 rounded-md font-bold tracking-wide shadow-md flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} /> Tulis Artikel Baru
        </Link>
      </div>

      <div className="bg-surface-container-lowest border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-surface flex justify-between items-center">
          <div className="relative w-full max-w-sm flex items-center">
             <Search className="absolute left-3 text-on-surface-variant" size={18} />
             <input 
               type="text" 
               placeholder="Cari judul artikel..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-white text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none"
             />
          </div>
          <div className="text-sm font-bold text-on-surface-variant">
            Total Artikel: {filteredBlogs.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-container-high text-on-surface uppercase font-headline">
              <tr>
                <th className="px-6 py-4 font-black w-24">Media</th>
                <th className="px-6 py-4 font-bold">Detail Artikel</th>
                <th className="px-6 py-4 font-bold">Publikasi</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant font-bold">
                    Memuat data artikel...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                    {searchTerm ? "Tidak ada artikel yang cocok dengan pencarian." : "Belum ada artikel yang dipublikasikan."}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 h-14 rounded-md overflow-hidden bg-surface-container-high border border-border">
                         <img src={blog.thumbnail || "https://placehold.co/100"} alt="Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-on-surface truncate max-w-sm">{blog.title}</div>
                      <div className="text-xs text-primary font-bold mt-1">/{blog.slug}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5 truncate max-w-sm">{blog.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 font-inter text-on-surface-variant">
                      {new Date(blog.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                          title="Lihat Publikasi"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <Link 
                          href={`/dashboard/cms/blog/${blog.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => {
                            setDeleteId(blog.id);
                            setDeleteTitle(blog.title);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus artikel <strong>"{deleteTitle}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
