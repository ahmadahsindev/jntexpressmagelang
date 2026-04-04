"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ReceiptData } from "@/components/resi/PrintTemplate";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [receipts, setReceipts] = useState<(ReceiptData & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "receipts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as (ReceiptData & { id: string })[];
        setReceipts(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Compute Metrics
  const totalResi = receipts.length;
  const delivered = receipts.filter(r => r.currentStatus === 'DELIVERED').length;
  const shipped = receipts.filter(r => r.currentStatus === 'SHIPPED').length;

  // Compute Monthly Data for Chart (e.g., last 6 months omzet)
  const monthlyDataMap: Record<string, number> = {};
  receipts.forEach(r => {
    // Determine target date from creation or delivery
    const d = new Date(r.date || r.createdAt);
    if (!isNaN(d.getTime())) {
      const monthYear = d.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
      monthlyDataMap[monthYear] = (monthlyDataMap[monthYear] || 0) + (Number(r.details?.shippingCost) || 0);
    }
  });
  
  // Sort reverse to make chronological order (since receipts are descending natively)
  const chartData = Object.entries(monthlyDataMap)
    .map(([name, omzet]) => ({ name, omzet }))
    .reverse();

  const totalOmzet = chartData.reduce((acc, c) => acc + c.omzet, 0);

  const formatRupiah = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black font-headline text-on-surface">Overview Dashboard</h1>
        <p className="text-on-surface-variant mt-1">Ringkasan aktivitas, status resi, dan wawasan pendapatan J&T Magelang.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        <Card className="bg-linear-to-br from-blue-50 to-white shadow-sm border-blue-100 flex flex-col justify-center">
           <CardContent className="p-6 flex items-center justify-between pb-6">
              <div>
                <p className="text-sm font-bold text-on-surface-variant mb-1">Total Resi</p>
                <p className="text-4xl font-black text-blue-600 font-headline">{totalResi}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full text-blue-600 shadow-sm border border-blue-200">
                <Package size={24} />
              </div>
           </CardContent>
        </Card>
        
        <Card className="bg-linear-to-br from-green-50 to-white shadow-sm border-green-100 flex flex-col justify-center">
           <CardContent className="p-6 flex items-center justify-between pb-6">
              <div>
                <p className="text-sm font-bold text-on-surface-variant mb-1">Delivered (Selesai)</p>
                <p className="text-4xl font-black text-green-600 font-headline">{delivered}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full text-green-600 shadow-sm border border-green-200">
                <CheckCircle size={24} />
              </div>
           </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-amber-50 to-white shadow-sm border-amber-100 flex flex-col justify-center">
           <CardContent className="p-6 flex items-center justify-between pb-6">
              <div>
                <p className="text-sm font-bold text-on-surface-variant mb-1">Shipped (Dikirim)</p>
                <p className="text-4xl font-black text-amber-500 font-headline">{shipped}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full text-amber-600 shadow-sm border border-amber-200">
                <Clock size={24} />
              </div>
           </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-purple-50 to-white shadow-sm border-purple-100 flex flex-col justify-center overflow-hidden">
           <CardContent className="p-6 flex items-center justify-between pb-6 relative z-10 w-full overflow-hidden">
              <div className="w-full flex space-x-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-on-surface-variant mb-1">Estimasi Omzet</p>
                  <p 
                     className="text-2xl font-black text-purple-600 font-headline truncate" 
                     title={formatRupiah(totalOmzet)}
                  >
                     {formatRupiah(totalOmzet)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full text-purple-600 shadow-sm border border-purple-200 shrink-0 self-center">
                  <TrendingUp size={24} />
                </div>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
           <CardHeader>
             <CardTitle className="font-headline font-black text-xl">Statistik Pendapatan</CardTitle>
             <CardDescription>Akumulasi total biaya pengiriman berdasarkan bulan (Omzet Kotor)</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="h-75 w-full">
               {chartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false}
                       tickLine={false}
                       tick={{ fill: '#64748b', fontSize: 12 }}
                       dy={10}
                     />
                     <YAxis
                       axisLine={false}
                       tickLine={false}
                       tick={{ fill: '#64748b', fontSize: 12 }}
                       tickFormatter={(value) => {
                         if (value >= 1000000) return `Rp${(value / 1000000).toFixed(1)}M`;
                         return `Rp${value / 1000}K`;
                       }}
                     />
                     <Tooltip 
                       formatter={(value: any) => [formatRupiah(value), "Omzet"]}
                       cursor={{ fill: '#f1f5f9' }}
                       contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
                     />
                     <Bar dataKey="omzet" fill="#e11d48" radius={[4, 4, 0, 0]} maxBarSize={50} />
                   </BarChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full w-full flex items-center justify-center text-on-surface-variant border-2 border-dashed border-border rounded-xl">
                   Belum ada data pendapatan.
                 </div>
               )}
             </div>
           </CardContent>
        </Card>

        {/* Recent Resi Column */}
        <Card className="shadow-sm flex flex-col">
           <CardHeader className="pb-4">
             <CardTitle className="font-headline font-black text-xl flex items-center justify-between">
               Resi Terbaru
               <Link href="/dashboard/resi" className="text-primary hover:underline text-sm font-bold flex items-center gap-1">
                 Lihat Semua
               </Link>
             </CardTitle>
             <CardDescription>Pembaruan 5 transaksi kiriman terakhir</CardDescription>
           </CardHeader>
           <CardContent className="flex-1">
             <div className="space-y-4">
               {receipts.slice(0, 5).map(receipt => (
                 <div key={receipt.id} className="flex justify-between items-center bg-surface p-3 hover:bg-surface-container-lowest transition-colors rounded-lg border border-border">
                   <div className="w-[60%]">
                     <p className="font-black text-on-surface text-sm">{receipt.receiptNumber}</p>
                     <p className="text-xs text-on-surface-variant uppercase mt-0.5 truncate">{receipt.receiver?.name || '...'}</p>
                   </div>
                   <div className="text-right w-[40%] flex flex-col items-end">
                     <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide inline-block
                         ${(receipt.currentStatus === 'DELIVERED' || receipt.currentStatus === 'TERKIRIM') ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}
                       `}>
                       {receipt.currentStatus}
                     </span>
                     <p className="text-[10px] text-on-surface-variant font-bold mt-1.5">
                       {new Date(receipt.date || receipt.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                     </p>
                   </div>
                 </div>
               ))}
               {receipts.length === 0 && (
                 <div className="text-center py-6 text-on-surface-variant italic border-2 border-dashed border-border rounded-xl">
                   Manajemen resi kosong.
                 </div>
               )}
             </div>
           </CardContent>
        </Card>
      </div>

    </div>
  );
}
