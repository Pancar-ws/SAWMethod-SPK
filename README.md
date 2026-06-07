# SPK Dispensasi Mahasiswa — Metode SAW

## Deskripsi Singkat

**SPK Dispensasi Mahasiswa** adalah Sistem Pendukung Keputusan (SPK) berbasis web yang menggunakan metode **Simple Additive Weighting (SAW)** untuk mengevaluasi dan merekomendasikan kelayakan pengajuan dispensasi akademik mahasiswa secara objektif dan transparan.

Sistem ini dikembangkan untuk Universitas Jenderal Soedirman guna membantu pengambil keputusan akademik menilai pengajuan dispensasi berdasarkan **6 kriteria** dengan bobot yang telah ditentukan.

## Fitur Utama

- **Penilaian Multi-Kriteria**: Evaluasi berbasis 6 aspek (jenis kegiatan, legalitas dokumen, rekam jejak, IPK, durasi absen, dan mata kuliah terdampak)
- **Transparan & Teraudit**: Setiap langkah perhitungan SAW ditampilkan secara lengkap
- **Ranking Otomatis**: Menghasilkan peringkat kelayakan berdasarkan nilai preferensi (Vi)
- **Manajemen Bobot**: Dukungan bobot benefit (4 kriteria) dan cost (2 kriteria)

## Struktur Proyek

```
.
├── index.html        # Halaman utama aplikasi
├── css/              # Styling & desain responsif
├── js/               # Logika aplikasi
│   ├── data.js       # Data kriteria & alternatif
│   ├── saw.js        # Implementasi algoritma SAW
│   └── app.js        # Kontrol aplikasi & UI
├── README.md         # Dokumentasi ini
└── .git/             # Versionning
```

## Cara Penggunaan

1. **Beranda**: Lihat ringkasan sistem dan kriteria penilaian
2. **Input Data**: Masukkan bobot kriteria dan nilai penilaian mahasiswa
3. **Perhitungan**: Ikuti langkah-langkah perhitungan SAW yang detail
4. **Hasil**: Lihat peringkat kelayakan dan rekomendasi final

## Teknologi

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Design**: Responsive, modern typography (DM Sans, DM Serif Display)
- **Method**: Simple Additive Weighting (SAW)

## Lisensi & Pengembang

© 2026 Universitas Jenderal Soedirman — Proyek Sistem Pendukung Keputusan Informatika