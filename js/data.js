/**
 * Data Parameter SPK Dispensasi Mahasiswa - Metode SAW
 * Tersinkronisasi dengan dokumen "1. Data Alternatif.csv" & "2. Normalisasi SAW.csv"
 */

const DEFAULT_DATA = {
  criteria: [
    { id: 'C1', name: 'Jenis Kegiatan', type: 'benefit', weight: 0.25, description: 'Benefit: Skor 1–5' },
    { id: 'C2', name: 'Legalitas Dokumen', type: 'benefit', weight: 0.25, description: 'Benefit: Skor 1–5' },
    { id: 'C3', name: 'Rekam Jejak Dispensasi', type: 'benefit', weight: 0.10, description: 'Benefit: Skor 1–5' },
    { id: 'C4', name: 'IPK Mahasiswa', type: 'benefit', weight: 0.15, description: 'Benefit: Skor 1–5' },
    { id: 'C5', name: 'Durasi Ketidakhadiran', type: 'cost', weight: 0.10, description: 'Cost: Skor 1–5' },
    { id: 'C6', name: 'Jumlah Matkul Terdampak', type: 'cost', weight: 0.15, description: 'Cost: Skor 1–5' }
  ],
  
  alternatives: [
    { id: 'A1', name: 'Yunan', values: [3, 4, 3, 5, 1, 2] },
    { id: 'A2', name: 'Fahmi', values: [5, 4, 4, 5, 3, 4] },
    { id: 'A3', name: 'Satria', values: [5, 5, 5, 4, 2, 3] },
    { id: 'A4', name: 'Renggo', values: [5, 3, 5, 4, 2, 2] },
    { id: 'A5', name: 'Athallah', values: [5, 5, 5, 5, 1, 1] }
  ]
};