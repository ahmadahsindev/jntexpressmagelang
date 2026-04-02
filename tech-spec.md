
---

## **Technical Specification: J&T Express Magelang Dynamic Web System**

### **1. Ringkasan Proyek**
Membangun platform *company profile* dinamis yang memungkinkan administrator mengelola seluruh konten teks, gambar, serta data resi pengiriman. Pengguna umum dapat melakukan pelacakan resi secara *real-time*.

### **2. Tech Stack**
| Komponen | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth (Admin Only) |
| **Storage / Media** | Cloudinary (Untuk gambar blog, galeri, & konten) |
| **State Management** | Zustand |
| **Validation** | Zod & React Hook Form |
| **Rich Text Editor** | Tiptap |

---

### **3. Arsitektur Informasi & Fitur**

#### **A. Halaman Publik (User)**
1.  **Home:** Banner dinamis, ringkasan layanan, dan *shortcut* cek resi.
2.  **Tentang Kami:** Sejarah, visi-misi, dan profil J&T Magelang.
3.  **Layanan:** Daftar layanan pengiriman (misal: EZ, J&T Eco, dsb).
4.  **Keunggulan:** Poin-poin nilai plus jasa.
5.  **Cek Resi:** Fitur pencarian resi berdasarkan nomor unik. Menampilkan histori perjalanan paket.
6.  **Blog & Galeri:** Artikel edukasi/informasi dan dokumentasi kegiatan.
7.  **Kontak:** Informasi alamat (terintegrasi Google Maps) dan WhatsApp API.

#### **B. Halaman Admin (Protected)**
1.  **Dashboard:** Ringkasan jumlah resi aktif dan statistik kunjungan sederhana.
2.  **Manajemen Konten (CMS):** Edit teks/gambar untuk semua halaman (Home, About, dll).
3.  **Manajemen Resi:** CRUD (*Create, Read, Update, Delete*) data resi, termasuk *update* status pengiriman secara berkala.
4.  **Manajemen Blog & Galeri:** Publikasi artikel dan unggah foto.

---

### **4. Skema Data (Firebase Firestore)**

#### **Koleksi: `receipts`**
Digunakan untuk menyimpan data pengiriman.
```json
{
  "receiptNumber": "37844537344611",
  "date": "2026-03-28T13:45:58Z",
  "origin": "MAGELANG",
  "destination": "KAB KARAWANG",
  "quantity": 1,
  "weight": 1,
  "volumeWeight": 1,
  "sender": {
    "name": "SUARDI",
    "address": "TUKANGAN KULON 56 RT.002 RW.009 KEL KEMIRIREJO KECAMATAN MAGELANG TENGAH",
    "phone": "-"
  },
  "receiver": {
    "name": "HUSEN IBRAHIM",
    "phone": "0851 6120 3039",
    "email": "-@gmail.com",
    "address": "KP BAKAN EMPANG RT002/RW010 KEC KOTA BARU KEL PUCUNG KAB KARANG ID 41374"
  },
  "details": {
    "itemType": "1 HP IPHONE 16 PROMAX 256 GB (IBOX) DESERT TITANIUM ON GARANSI",
    "shippingType": "HP",
    "via": "EXPRESS",
    "shippingCost": 205710
  },
  "statusHistory": [
    {
      "status": "ON PROSES KIRIM",
      "timestamp": "2026-03-28T13:45:58Z",
      "location": "Jakarta"
    }
  ],
  "currentStatus": "ON PROSES KIRIM",
  "createdAt": "2026-03-28T13:45:58Z"
}
```

#### **Koleksi: `content`**
Digunakan untuk membuat website menjadi dinamis.
* **Document ID:** `homepage`, `about`, `services`.
* **Fields:** Menyimpan objek berisi teks dan URL gambar dari Storage.

---

### **5. Alur Kerja Fitur Utama (Cek Resi)**

1.  **Input:** User memasukkan nomor resi pada kolom pencarian.
2.  **Query:** Next.js melakukan *fetch* ke Firestore dengan query `where("receiptNumber", "==", input)`.
3.  **Response:**
    * Jika ditemukan: Menampilkan detail resi (Pengirim, Penerima, Detail Paket) beserta urutan `statusHistory` menggunakan **Vertical Stepper Timeline UI** dari yang terbaru. Terdapat ekstensi fitur: tombol "Cetak Resi" (menggunakan `react-to-print`) dan "Download" untuk mencetak dokumen format J&T Express Magelang resmi (menyertakan Barcode dinamis via `react-barcode`).
    * Jika tidak ditemukan: Menampilkan pesan "Nomor Resi Tidak Ditemukan".


---

### **6. Rencana Implementasi**

1.  **Fase 1: Setup & Integrasi**
    * Inisialisasi Next.js 16 dan Tailwind 4.
    * Konfigurasi Firebase SDK (Client & Admin).
2.  **Fase 2: Pengembangan UI/UX**
    * Pembuatan komponen *reusable* (Navbar, Footer, Layout).
    * Implementasi Tailwind 4 untuk desain responsif yang menyerupai referensi.
3.  **Fase 3: Fitur Admin & CMS**
    * Setup Firebase Auth untuk keamanan akses admin.
    * Pembuatan *form* dinamis untuk mengubah konten website langsung dari *browser*.
4.  **Fase 4: Fitur Resi & Testing**
    * Implementasi logika pencarian resi.
    * Uji coba fungsionalitas dan performa (*Core Web Vitals*).

---

### **7. Keamanan & Performa**
* **Firestore Security Rules:** Memastikan hanya admin yang bisa menulis (`write`) data, sementara publik hanya bisa membaca (`read`) data resi tertentu.
* **Server-Side Rendering (SSR):** Menggunakan fitur Next.js untuk SEO yang lebih baik pada halaman blog.
* **Image Optimization:** TIDAK MENGGUNAKAN komponen `next/image`. Semua gambar di aplikasi wajib dimuat menggunakan native HTML label `<img>` dan disimpan menggunakan Cloudinary agar fleksibel pada Rich Text (*Tiptap*) maupun statis.

---

### **8. Panduan Desain & UX (Styling Guide)**

Berpedoman pada *creative North Star* "The Kinetic Authority" (High-End Editorial estetika):
*   **Warna Utama:** 
    *   `primary`: `#bb0013` (J&T Red)
    *   `primary_container`: `#e71520` (Variant Hero)
    *   `background`: `#f8f9fa`
*   **Layering (Tonal Level):** Hindari garis pembatas solid (No-Line Rule). Buat separasi konten menggunakan perbedaan warna dasar (*Surface Containers* seperti `surface_container_lowest` dan `surface_container_highest`).
*   **Tipografi:**
    *   **Manrope** (Display/Headline) untuk teks judul besar dan tegas.
    *   **Inter** (Title/Body/Label) untuk teks resi fungsional dan bacaan utama.
*   **Dimensi & Efek:**
    *   Menggunakan *Glassmorphism* (backdrop-blur) pada navigasi (Navbar) atau overlayer pop-up.
    *   Menggunakan warna *gradient* vertikal dari `primary` ke `primary_container` pada tombol (CTA) utama.
    *   Menggunakan *shadcn/ui* dan `lucide-react` untuk komponen dasar tata letak fungsional admin.