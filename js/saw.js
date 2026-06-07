/**
 * Engine Algoritma Simple Additive Weighting (SAW)
 */

function calculateNormalization(decisionMatrix, criteriaTypes) {
  const m = decisionMatrix.length;
  const n = criteriaTypes.length;
  const normalized = Array.from({ length: m }, () => Array(n).fill(0));

  for (let j = 0; j < n; j++) {
    const columnValues = decisionMatrix.map(row => row[j]);
    const maxVal = Math.max(...columnValues);
    const minVal = Math.min(...columnValues);

    for (let i = 0; i < m; i++) {
      const val = decisionMatrix[i][j];
      if (criteriaTypes[j] === 'benefit') {
        normalized[i][j] = maxVal === 0 ? 0 : val / maxVal;
      } else {
        // Atribut Cost -> min / x
        normalized[i][j] = val === 0 ? 0 : minVal / val;
      }
    }
  }
  return normalized;
}

function processSAW(decisionMatrix, weights, criteriaTypes) {
  if (decisionMatrix.length === 0 || weights.length === 0) {
    throw new Error('Dataset matriks tidak valid / kosong.');
  }

  // Standarisasi Bobot jika total bukan 1
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const w = totalWeight === 0 ? weights.map(() => 1 / weights.length) : weights.map(val => val / totalWeight);

  // 1. Normalisasi (R)
  const normalizedMatrix = calculateNormalization(decisionMatrix, criteriaTypes);

  // 2. Nilai Preferensi Akhir (V)
  const preferenceScores = normalizedMatrix.map(row => {
    return row.reduce((sum, val, j) => sum + (val * w[j]), 0);
  });

  // 3. Klasifikasi Peringkat
  const ranking = preferenceScores
    .map((score, index) => ({ index, score }))
    .sort((a, b) => b.score - a.score)
    .map((item, rank) => ({ ...item, rank: rank + 1 }));

  return {
    normalizedWeights: w,
    normalizedMatrix,
    preferenceScores,
    ranking
  };
}

function formatVal(num, decimals = 4) {
  return (num === null || isNaN(num)) ? '-' : Number(num).toFixed(decimals);
}