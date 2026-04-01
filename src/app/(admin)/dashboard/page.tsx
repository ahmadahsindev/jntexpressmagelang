export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black font-headline text-on-surface">Overview</h1>
      <p className="text-on-surface-variant">Ringkasan aktivitas dan status resi pengiriman J&T Magelang.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl tonal-shift-bottom">
          <p className="text-sm font-bold text-on-surface-variant mb-1">Total Resi Aktif</p>
          <p className="text-4xl font-black text-primary font-headline">124</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl tonal-shift-bottom">
          <p className="text-sm font-bold text-on-surface-variant mb-1">Selesai Dikirim</p>
          <p className="text-4xl font-black text-green-600 font-headline">892</p>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl tonal-shift-bottom">
          <p className="text-sm font-bold text-on-surface-variant mb-1">Dalam Proses</p>
          <p className="text-4xl font-black text-amber-500 font-headline">45</p>
        </div>
      </div>
    </div>
  );
}
