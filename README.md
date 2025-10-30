# Lapor Jalan Rusak (KLP11-12)

Deskripsi singkat  
Aplikasi untuk melaporkan jalan rusak di wilayah pengguna. Pengguna dapat mengirim laporan berisi foto, lokasi, dan deskripsi; admin dapat meninjau dan menandai status perbaikan.

## Fitur
- Kirim laporan dengan foto dan deskripsi
- Deteksi/penentuan lokasi (GPS / input manual)
- Daftar laporan (filter berdasarkan status)
- Panel admin untuk mengubah status laporan (baru / diproses / selesai)
- Notifikasi status (opsional)

## Teknologi
- Frontend: HTML/CSS/JavaScript 
- Backend: Node.js / Express 
- Database: MySQL / 
- Penyimpanan file: Local
- Peta: Leaflet 

## Instalasi 
1. Clone repositori
    ```
    git clone <repo-url>
    cd <project-folder>
    ```
2. Install dependencies
    ```
    npm install
    ```
3. Konfigurasi environment
    - Salin `.env.example` ke `.env` dan isi variabel (database, storage)
4. Jalankan aplikasi
    ```
    node app
    ```

