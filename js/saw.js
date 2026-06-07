// saw.js — Simple Additive Weighting (SAW)

/**
 * Implementasi Metode SAW
 * Simple Additive Weighting
 */

function normalizeWeights(weights) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map((w) => w / sum);
}

/**
 * Normalisasi matriks keputusan menggunakan metode SAW:
 * - Benefit: r_ij = x_ij / max(x_j)
 * - Cost:    r_ij = min(x_j) / x_ij
 */
function saw(decisionMatrix, weights, criteriaTypes) {
  const m = decisionMatrix.length; // jumlah alternatif
  const n = weights.length;        // jumlah kriteria

  if (m === 0 || n === 0) {
    throw new Error('Matriks keputusan tidak boleh kosong.');
  }

  const normalizedWeights = normalizeWeights(weights);

  // Hitung max & min tiap kolom
  const colMax = [];
  const colMin = [];
  for (let j = 0; j < n; j++) {
    const col = decisionMatrix.map((row) => row[j]);
    colMax[j] = Math.max(...col);
    colMin[j] = Math.min(...col);
  }

  // Normalisasi
  const normalized = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const val = decisionMatrix[i][j];
      if (criteriaTypes[j] === 'benefit') {
        normalized[i][j] = colMax[j] === 0 ? 0 : val / colMax[j];
      } else {
        // cost
        normalized[i][j] = val === 0 ? 0 : colMin[j] / val;
      }
    }
  }

  // Hitung nilai preferensi Vi = Σ(wj × rij)
  const preference = normalized.map((row) =>
    row.reduce((sum, val, j) => sum + normalizedWeights[j] * val, 0)
  );

  // Weighted contribution table (per kriteria)
  const weightedContrib = normalized.map((row) =>
    row.map((val, j) => val * normalizedWeights[j])
  );

  // Ranking
  const ranking = preference
    .map((pref, i) => ({ index: i, preference: pref }))
    .sort((a, b) => b.preference - a.preference)
    .map((item, rank) => ({ ...item, rank: rank + 1 }));

  return {
    normalizedWeights,
    colMax,
    colMin,
    normalized,
    weightedContrib,
    preference,
    ranking
  };
}

function formatNumber(num, decimals = 4) {
  if (num === null || num === undefined || Number.isNaN(num)) return '-';
  return Number(num).toFixed(decimals);
}