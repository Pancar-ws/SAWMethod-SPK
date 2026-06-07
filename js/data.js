// data.js — SPK Dispensasi Mahasiswa (SAW)

const DEFAULT_DATA = {
  title: 'SPK Pengajuan Dispensasi Mahasiswa',
  subtitle: 'Universitas Jenderal Soedirman',
  method: 'SAW (Simple Additive Weighting)',
  description: 'Sistem Pendukung Keputusan untuk menentukan kelayakan pengajuan dispensasi mahasiswa berdasarkan 6 kriteria menggunakan metode SAW.',
  authors: [
    'Tim Seleksi Akademik / Peneliti',
  ],

  criteria: [
    {
      id: 'C1',
      name: 'Jenis Kegiatan',
      type: 'benefit',
      weight: 0.25,
      description: 'Benefit (25%) | 5=Internasional/Nasional, 4=Univ, 3=Fakultas, 2=Org Internal, 1=Kecil',
      scale: '1–5'
    },
    {
      id: 'C2',
      name: 'Legalitas Dokumen',
      type: 'benefit',
      weight: 0.25,
      description: 'Benefit (25%) | 5=Lengkap, 4=Kurang Jelas, 3=Sebagian, 2=Tidak Lengkap, 1=Tidak Ada',
      scale: '1–5'
    },
    {
      id: 'C3',
      name: 'Rekam Jejak Dispensasi',
      type: 'benefit',
      weight: 0.10,
      description: 'Benefit (10%) | 5=Bergengsi, 4=Biasa, 3=Belum Pernah, 2=Ditolak Syarat, 1=Ditolak Pelanggaran',
      scale: '1–5'
    },
    {
      id: 'C4',
      name: 'IPK Mahasiswa',
      type: 'benefit',
      weight: 0.15,
      description: 'Benefit (15%) | 5=≥3.50, 4=3.00-3.49, 3=2.75-2.99, 2=2.50-2.74, 1=<2.50',
      scale: '1–5'
    },
    {
      id: 'C5',
      name: 'Durasi Ketidakhadiran',
      type: 'cost',
      weight: 0.10,
      description: 'Cost (10%) | 5=>12 hari, 4=9-12 hari, 3=6-8 hari, 2=3-5 hari, 1=1-2 hari',
      scale: '1–5'
    },
    {
      id: 'C6',
      name: 'Jumlah Mata Kuliah Terdampak',
      type: 'cost',
      weight: 0.15,
      description: 'Cost (15%) | 5=>15 MK, 4=11-14 MK, 3=7-10 MK, 2=3-6 MK, 1=1-2 MK',
      scale: '1–5'
    }
  ],

  alternatives: [
    { id: 'A1', name: 'Mahasiswa 1',    kegiatan: 'Pengabdian Masyarakat ke Desa',             values: [3, 4, 3, 5, 1, 2] },
    { id: 'A2', name: 'Mahasiswa 2',    kegiatan: 'Lomba MTQMN Tingkat Nasional',              values: [5, 4, 4, 5, 3, 4] },
    { id: 'A3', name: 'Mahasiswa 3',   kegiatan: 'Kontes Robot Terbang Indonesia',            values: [5, 5, 5, 4, 2, 3] },
    { id: 'A4', name: 'Mahasiswa 4',   kegiatan: 'P2MW (Program Kemendikbud)',                values: [5, 3, 5, 4, 2, 2] },
    { id: 'A5', name: 'Mahasiswa 5',  kegiatan: 'Lomba Robot Nasional & Beasiswa',           values: [5, 5, 5, 5, 1, 1] }
  ],

  // Referensi hasil akhir yang benar berdasarkan bobot C5 (10%) dan C6 (15%)
  expectedResults: [
    { name: 'Mahasiswa 5', preference: 1.0000, rank: 1 },
    { name: 'Mahasiswa 2',  preference: 0.8200, rank: 2 },
    { name: 'Mahasiswa 3',   preference: 0.7700, rank: 3 },
    { name: 'Mahasiswa 4',  preference: 0.7550, rank: 4 },
    { name: 'Mahasiswa 1',   preference: 0.7516, rank: 5 }
  ]
};