/**
 * Implementasi Metode SAW
 * Simple Additive Weighting
 */

function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => w / sum);
}

function saw(decisionMatrix, weights, criteriaTypes) {
  const m = decisionMatrix.length;
  const n = weights.length;

  if (m === 0 || n === 0) {
    throw new Error('Matriks keputusan tidak boleh kosong.');
  }

  const normalizedWeights = normalizeWeights(weights);
  const normalized = Array.from({ length: m }, () => Array(n).fill(0));

  // 1. Cari nilai Max dan Min untuk setiap kriteria
  const maxVals = [];
  const minVals = [];
  for (let j = 0; j < n; j++) {
    const col = decisionMatrix.map(row => row[j]);
    maxVals[j] = Math.max(...col);
    minVals[j] = Math.min(...col);
  }

  // 2. Normalisasi Matriks berdasarkan Cost/Benefit
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const val = decisionMatrix[i][j];
      if (criteriaTypes[j] === 'benefit') {
        normalized[i][j] = maxVals[j] === 0 ? 0 : val / maxVals[j];
      } else { 
        // tipe cost
        normalized[i][j] = val === 0 ? 0 : minVals[j] / val;
      }
    }
  }

  // 3. Hitung Nilai Preferensi (V)
  const preference = [];
  for (let i = 0; i < m; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += normalized[i][j] * normalizedWeights[j];
    }
    preference[i] = sum;
  }

  // 4. Perangkingan
  const ranking = preference
    .map((pref, i) => ({ index: i, preference: pref }))
    .sort((a, b) => b.preference - a.preference)
    .map((item, rank) => ({ ...item, rank: rank + 1 }));

  return {
    normalizedWeights,
    maxVals,
    minVals,
    normalized,
    preference,
    ranking
  };
}

function formatNumber(num, decimals = 4) {
  if (num === null || num === undefined || Number.isNaN(num)) return '-';
  return Number(num).toFixed(decimals);
}