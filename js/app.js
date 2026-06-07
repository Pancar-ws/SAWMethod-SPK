// app.js — SPK Dispensasi Mahasiswa (SAW)

let appState = {
  criteria: structuredClone(DEFAULT_DATA.criteria),
  alternatives: structuredClone(DEFAULT_DATA.alternatives),
  result: null
};

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBeranda();
  initTentang();
  renderInputTables();
  bindEvents();
});

// ─── Navigation ──────────────────────────────────────────────────────────────
function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });
  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => navigateTo(el.dataset.goto));
  });
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('mainNav');
  if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('open'));
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
  document.getElementById(`page-${pageId}`)?.classList.add('active');
  document.querySelector(`.nav-btn[data-page="${pageId}"]`)?.classList.add('active');
  document.getElementById('mainNav')?.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Beranda ────────────────────────────────────────────────────────────────
function initBeranda() {
  const el = document.getElementById('criteriaOverview');
  if (!el) return;
  el.innerHTML = appState.criteria.map((c) => `
    <div class="criteria-item ${c.type}">
      <div class="crit-code">${c.id}</div>
      <div class="crit-name">${c.name}</div>
      <div class="crit-weight">${(c.weight * 100).toFixed(0)}%</div>
      <div class="crit-type ${c.type}">${c.type === 'benefit' ? 'Benefit ↑' : 'Cost ↓'}</div>
    </div>`).join('');
}

// ─── Tentang ────────────────────────────────────────────────────────────────
function initTentang() {
  const ukmEl = document.getElementById('altList');
  if (ukmEl) {
    ukmEl.innerHTML = appState.alternatives.map((a) => `
      <div class="alt-card">
        <span class="alt-id">${a.id}</span>
        <span class="alt-name">${a.name}</span>
        <span class="alt-desc">${a.kegiatan}</span>
      </div>`).join('');
  }
  const authEl = document.getElementById('authorsList');
  if (authEl) {
    authEl.innerHTML = DEFAULT_DATA.authors.map((a) => `<li>${a}</li>`).join('');
  }
}

// ─── Input Tables ────────────────────────────────────────────────────────────
function renderInputTables() {
  renderWeightTable();
  renderMatrixTable();
  updateWeightTotal();
}

function renderWeightTable() {
  const tbody = document.querySelector('#weightTable tbody');
  if (!tbody) return;
  tbody.innerHTML = appState.criteria.map((c, i) => `
    <tr>
      <td><strong>${c.id}</strong></td>
      <td>${c.name}</td>
      <td><span class="type-badge ${c.type}">${c.type === 'benefit' ? 'Benefit' : 'Cost'}</span></td>
      <td>
        <input type="number" min="0" max="1" step="0.01"
          value="${c.weight}" data-weight-index="${i}" class="weight-input">
      </td>
      <td class="desc-cell">${c.description}</td>
    </tr>`).join('');
}

function renderMatrixTable() {
  const thead = document.querySelector('#matrixTable thead');
  const tbody = document.querySelector('#matrixTable tbody');
  if (!thead || !tbody) return;

  const headerCells = appState.criteria.map((c) =>
    `<th>${c.id}<br><small>${c.name}</small></th>`).join('');
  thead.innerHTML = `<tr><th>No</th><th>Nama Mahasiswa</th><th>Kegiatan</th>${headerCells}</tr>`;

  tbody.innerHTML = appState.alternatives.map((alt, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${alt.name}</strong></td>
      <td class="kegiatan-cell">${alt.kegiatan}</td>
      ${alt.values.map((val, j) => `
        <td>
          <input type="number" min="1" max="5" step="1"
            value="${val}" data-alt-index="${i}" data-crit-index="${j}" class="matrix-input">
        </td>`).join('')}
    </tr>`).join('');
}

function updateWeightTotal() {
  const total = appState.criteria.reduce((s, c) => s + c.weight, 0);
  const el = document.getElementById('weightTotal');
  if (!el) return;
  el.textContent = `Total Bobot: ${formatNumber(total, 4)}`;
  el.classList.toggle('invalid', Math.abs(total - 1) > 0.01);
}

// ─── Events ──────────────────────────────────────────────────────────────────
function bindEvents() {
  document.getElementById('weightTable')?.addEventListener('input', (e) => {
    if (!e.target.classList.contains('weight-input')) return;
    const idx = parseInt(e.target.dataset.weightIndex, 10);
    appState.criteria[idx].weight = parseFloat(e.target.value) || 0;
    updateWeightTotal();
  });

  document.getElementById('matrixTable')?.addEventListener('input', (e) => {
    if (!e.target.classList.contains('matrix-input')) return;
    const ai = parseInt(e.target.dataset.altIndex, 10);
    const ci = parseInt(e.target.dataset.critIndex, 10);
    appState.alternatives[ai].values[ci] = parseFloat(e.target.value) || 0;
  });

  document.getElementById('btnReset')?.addEventListener('click', () => {
    appState.criteria     = structuredClone(DEFAULT_DATA.criteria);
    appState.alternatives = structuredClone(DEFAULT_DATA.alternatives);
    appState.result       = null;
    renderInputTables();
    hideResults();
  });

  document.getElementById('btnCalculate')?.addEventListener('click', calculate);
  document.getElementById('btnPrint')?.addEventListener('click', () => window.print());
}

// ─── Calculate ───────────────────────────────────────────────────────────────
function calculate() {
  const weights = appState.criteria.map((c) => c.weight);
  const types   = appState.criteria.map((c) => c.type);
  const matrix  = appState.alternatives.map((a) => [...a.values]);
  const names   = appState.alternatives.map((a) => a.name);
  const labels  = appState.criteria.map((c) => c.id);

  try {
    const result = saw(matrix, weights, types);
    appState.result = { ...result, names, labels };
    renderCalculation();
    renderResults();
    navigateTo('hasil');
  } catch (err) {
    alert('Terjadi kesalahan: ' + err.message);
  }
}

function hideResults() {
  document.getElementById('calcEmpty')?.classList.remove('hidden');
  document.getElementById('calcContent')?.classList.add('hidden');
  document.getElementById('resultEmpty')?.classList.remove('hidden');
  document.getElementById('resultContent')?.classList.add('hidden');
}

// ─── Render Calculation ──────────────────────────────────────────────────────
function buildTableHTML(matrix, names, labels, extra = null) {
  const headerCols = labels.map((l) => `<th>${l}</th>`).join('');
  const extraHeader = extra ? `<th>${extra}</th>` : '';
  const rows = matrix.map((row, i) => {
    const cells = row.map((v) => `<td>${formatNumber(v)}</td>`).join('');
    const extraCell = extra ? '' : '';
    return `<tr><td>${i + 1}</td><td><strong>${names[i]}</strong></td>${cells}${extraCell}</tr>`;
  }).join('');
  return `
    <table class="data-table">
      <thead><tr><th>No</th><th>Alternatif</th>${headerCols}${extraHeader}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderCalculation() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('calcEmpty')?.classList.add('hidden');
  document.getElementById('calcContent')?.classList.remove('hidden');

  const matrix = appState.alternatives.map((a) => [...a.values]);

  // Step 1 – Decision matrix
  const s1Header = appState.criteria.map((c) => `<th>${c.id}</th>`).join('');
  const s1Rows = appState.alternatives.map((alt, i) => {
    const cells = alt.values.map((v) => `<td>${v}</td>`).join('');
    return `<tr><td>${i+1}</td><td><strong>${alt.name}</strong></td><td class="desc-cell">${alt.kegiatan}</td>${cells}</tr>`;
  }).join('');
  document.getElementById('stepMatrix').innerHTML = `
    <table class="data-table">
      <thead><tr><th>No</th><th>Nama</th><th>Kegiatan</th>${s1Header}</tr></thead>
      <tbody>${s1Rows}</tbody>
    </table>`;

  // Step 2 – Max/Min table
  const s2Cols = r.labels.map((l, j) => `
    <td>${r.colMax[j]}</td>`).join('');
  const s2ColsMin = r.labels.map((l, j) => `
    <td>${r.colMin[j]}</td>`).join('');
  const s2Header = r.labels.map((l) => `<th>${l}</th>`).join('');
  const s2Types = appState.criteria.map((c) => `<td><span class="type-badge ${c.type}">${c.type}</span></td>`).join('');
  document.getElementById('stepMaxMin').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Statistik</th>${s2Header}</tr></thead>
      <tbody>
        <tr><td><strong>Tipe</strong></td>${s2Types}</tr>
        <tr><td><strong>Max</strong></td>${s2Cols}</tr>
        <tr><td><strong>Min</strong></td>${s2ColsMin}</tr>
      </tbody>
    </table>`;

  // Step 3 – Normalized matrix
  document.getElementById('stepNormalized').innerHTML = buildTableHTML(r.normalized, r.names, r.labels);

  // Step 4 – Weighted contributions
  const wHeader = r.labels.map((l, j) =>
    `<th>${l}<br><small>×${formatNumber(r.normalizedWeights[j], 2)}</small></th>`).join('');
  const wRows = r.weightedContrib.map((row, i) => {
    const cells = row.map((v) => `<td>${formatNumber(v)}</td>`).join('');
    return `<tr><td>${i+1}</td><td><strong>${r.names[i]}</strong></td>${cells}</tr>`;
  }).join('');
  document.getElementById('stepWeighted').innerHTML = `
    <table class="data-table">
      <thead><tr><th>No</th><th>Alternatif</th>${wHeader}</tr></thead>
      <tbody>${wRows}</tbody>
    </table>`;

  // Step 5 – Preference values ranked
  const prefRows = r.ranking.map((item) => `
    <tr>
      <td>${item.rank}</td>
      <td><strong>${r.names[item.index]}</strong></td>
      <td><strong>${formatNumber(item.preference)}</strong></td>
    </tr>`).join('');
  document.getElementById('stepPreference').innerHTML = `
    <table class="data-table">
      <thead><tr><th>Ranking</th><th>Alternatif</th><th>Nilai Preferensi (Vi)</th></tr></thead>
      <tbody>${prefRows}</tbody>
    </table>`;
}

// ─── Render Results ──────────────────────────────────────────────────────────
function renderResults() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('resultEmpty')?.classList.add('hidden');
  document.getElementById('resultContent')?.classList.remove('hidden');

  const winner = r.ranking[0];
  const winnerName = r.names[winner.index];
  const winnerAlt  = appState.alternatives[winner.index];

  document.getElementById('resultHero').innerHTML = `
    <div class="trophy-icon">✅</div>
    <div class="hero-label">Mahasiswa Paling Layak Mendapat Dispensasi</div>
    <div class="hero-winner">${winnerName}</div>
    <div class="hero-detail">${winnerAlt.kegiatan}</div>
    <div class="hero-score">Nilai Preferensi: <strong>${formatNumber(winner.preference)}</strong></div>`;

  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = r.ranking.map((item) => {
    const name = r.names[item.index];
    const alt  = appState.alternatives[item.index];
    const rankClass = item.rank <= 3 ? `rank-${item.rank}` : 'rank-other';
    const status = item.rank === 1
      ? '<span class="status-approved">✔ Direkomendasikan</span>'
      : item.rank === 2 || item.rank === 3
        ? '<span class="status-consider">◎ Pertimbangkan</span>'
        : '<span class="status-normal">— Alternatif</span>';
    return `
      <tr>
        <td><span class="rank-badge ${rankClass}">${item.rank}</span></td>
        <td><strong>${name}</strong></td>
        <td class="desc-cell">${alt.kegiatan}</td>
        <td><strong>${formatNumber(item.preference)}</strong></td>
        <td>${status}</td>
      </tr>`;
  }).join('');

  const rankingText = r.ranking.map((item) =>
    `${item.rank}. ${r.names[item.index]} (${formatNumber(item.preference)})`).join(' | ');

  document.getElementById('reportText').innerHTML = `
    <p><strong>Laporan Analisis SPK Dispensasi — Metode SAW</strong></p>
    <p>
      Berdasarkan perhitungan SAW dengan <strong>${appState.criteria.length} kriteria</strong>
      (${appState.criteria.map((c) => c.name).join(', ')}) dan
      <strong>${appState.alternatives.length} alternatif</strong> mahasiswa,
      sistem menghasilkan peringkat kelayakan dispensasi sebagai berikut:
    </p>
    <p class="ranking-inline">${rankingText}</p>
    <p>
      <strong>${winnerName}</strong> memperoleh nilai preferensi tertinggi sebesar
      <strong>${formatNumber(winner.preference)}</strong>, menjadikannya kandidat paling
      layak mendapat persetujuan dispensasi. Kegiatan yang diajukan adalah
      "<em>${winnerAlt.kegiatan}</em>", yang dinilai memenuhi seluruh kriteria secara optimal.
    </p>
    <p>
      Kriteria dominan dalam penilaian ini adalah <strong>Jenis Kegiatan</strong>
      (${appState.criteria[0].weight * 100}%) dan
      <strong>Legalitas Dokumen</strong> (${appState.criteria[1].weight * 100}%),
      sehingga mahasiswa yang mengikuti kegiatan bereputasi tinggi dengan dokumen lengkap
      cenderung memperoleh nilai preferensi lebih tinggi.
    </p>
    <p class="report-footer">
      Dihasilkan oleh SPK Dispensasi Mahasiswa — Metode SAW |
      ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>`;
}