/**
 * Data SPK Dispensasi Mahasiswa - Metode SAW
 */

const DEFAULT_DATA = {
  title: 'SPK Pengajuan Dispensasi Mahasiswa',
  subtitle: 'Fakultas Teknik Universitas Jenderal Soedirman',
  method: 'SAW',
  authors: [
    'Pancar Wahyu Setiabi (Informatika - Unsoed)',
    'Tim Seleksi Akademik'
  ],
  criteria: [
    {
      id: 'C1',
      name: 'Penghasilan Orang Tua',
      type: 'cost',
      weight: 0.35,
      description: 'Total pendapatan kotor orang tua per bulan (Rp)'
    },
    {
      id: 'C2',
      name: 'Jumlah Tanggungan',
      type: 'benefit',
      weight: 0.25,
      description: 'Jumlah anak yang masih menjadi tanggungan'
    },
    {
      id: 'C3',
      name: 'Semester',
      type: 'benefit',
      weight: 0.15,
      description: 'Semester yang sedang ditempuh'
    },
    {
      id: 'C4',
      name: 'IPK',
      type: 'benefit',
      weight: 0.15,
      description: 'Indeks Prestasi Kumulatif terakhir'
    },
    {
      id: 'C5',
      name: 'Tagihan Listrik & Air',
      type: 'cost',
      weight: 0.10,
      description: 'Rata-rata tagihan per bulan (Rp)'
    }
  ],
  alternatives: [
    { id: 'A1', name: 'Budi Santoso', values: [3000000, 3, 4, 3.50, 150000] },
    { id: 'A2', name: 'Siti Aminah', values: [1500000, 4, 6, 3.80, 100000] },
    { id: 'A3', name: 'Andi Wijaya', values: [5000000, 2, 2, 3.20, 300000] },
    { id: 'A4', name: 'Rina Melati', values: [2000000, 5, 8, 3.90, 120000] },
    { id: 'A5', name: 'Joko Anwar', values: [2500000, 3, 4, 3.10, 200000] }
  ]
};