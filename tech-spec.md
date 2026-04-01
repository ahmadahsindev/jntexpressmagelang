
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
| **Storage** | Firebase Storage (Untuk gambar blog, galeri, & konten) |
| **State Management** | React Context API atau Zustand |
| **Validation** | Zod & React Hook Form |

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
  "receiptNumber": "JT123456789",
  "sender": {
    "name": "Nama Pengirim",
    "address": "Alamat Lengkap",
    "phone": "0812..."
  },
  "receiver": {
    "name": "Nama Penerima",
    "address": "Alamat Lengkap",
    "phone": "0851..."
  },
  "details": {
    "itemType": "Elektronik",
    "weight": 1,
    "service": "Express",
    "shippingCost": 20000
  },
  "statusHistory": [
    {
      "status": "Paket telah diterima di Drop Point Magelang",
      "timestamp": "2026-04-01T10:00:00Z",
      "location": "Magelang"
    }
  ],
  "currentStatus": "On Process",
  "createdAt": "2026-03-31T22:31:00Z"
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
    * Jika ditemukan: Menampilkan detail pengirim, penerima, dan urutan `statusHistory` dari yang terbaru (menggunakan fungsi `.sort()`).
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
* **Image Optimization:** Menggunakan komponen `next/image` untuk memuat gambar secara *lazy load* dan efisien.

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