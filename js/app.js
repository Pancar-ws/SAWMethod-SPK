/**
 * SPK Dispensasi Mahasiswa — Aplikasi Utama
 */

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

function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', () => navigateTo(el.dataset.goto));
  });

  navToggle.addEventListener('click', () => nav.classList.toggle('open'));
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));

  document.getElementById(`page-${pageId}`).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
  document.getElementById('mainNav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initBeranda() {
  const container = document.getElementById('criteriaOverview');
  container.innerHTML = appState.criteria
    .map(
      (c) => `
      <div class="criteria-item">
        <div class="code">${c.id}</div>
        <div class="name">${c.name}</div>
        <div class="weight">${(c.weight * 100).toFixed(0)}%</div>
        <div class="type">${c.type === 'benefit' ? 'Benefit' : 'Cost'}</div>
      </div>`
    )
    .join('');
}

function initTentang() {
  document.getElementById('authorsList').innerHTML = DEFAULT_DATA.authors
    .map((a) => `<li>${a}</li>`)
    .join('');
}

function renderInputTables() {
  renderWeightTable();
  renderMatrixTable();
  updateWeightTotal();
}

function renderWeightTable() {
  const tbody = document.querySelector('#weightTable tbody');
  tbody.innerHTML = appState.criteria
    .map(
      (c, i) => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td>${c.name}</td>
        <td><span class="type-badge ${c.type}">${c.type}</span></td>
        <td>
          <input type="number" min="0" max="1" step="0.01"
            value="${c.weight}" data-weight-index="${i}" class="weight-input">
        </td>
        <td style="color:var(--text-muted);font-size:0.8rem">${c.description}</td>
      </tr>`
    )
    .join('');
}

function renderMatrixTable() {
  const thead = document.querySelector('#matrixTable thead');
  const tbody = document.querySelector('#matrixTable tbody');

  const headerCells = appState.criteria.map((c) => `<th>${c.id}<br><small>${c.name}</small></th>`).join('');
  thead.innerHTML = `<tr><th>No</th><th>Nama Mahasiswa</th>${headerCells}</tr>`;

  tbody.innerHTML = appState.alternatives
    .map(
      (alt, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${alt.name}</strong></td>
        ${alt.values
          .map(
            (val, j) => `
          <td>
            <input type="number" min="0" step="any"
              value="${val}" data-alt-index="${i}" data-crit-index="${j}" class="matrix-input">
          </td>`
          )
          .join('')}
      </tr>`
    )
    .join('');
}

function updateWeightTotal() {
  const total = appState.criteria.reduce((sum, c) => sum + c.weight, 0);
  const el = document.getElementById('weightTotal');
  el.textContent = `Total: ${formatNumber(total, 4)}`;
  el.classList.toggle('invalid', Math.abs(total - 1) > 0.01);
}

function bindEvents() {
  document.getElementById('weightTable').addEventListener('input', (e) => {
    if (!e.target.classList.contains('weight-input')) return;
    const idx = parseInt(e.target.dataset.weightIndex, 10);
    appState.criteria[idx].weight = parseFloat(e.target.value) || 0;
    updateWeightTotal();
  });

  document.getElementById('matrixTable').addEventListener('input', (e) => {
    if (!e.target.classList.contains('matrix-input')) return;
    const altIdx = parseInt(e.target.dataset.altIndex, 10);
    const critIdx = parseInt(e.target.dataset.critIndex, 10);
    appState.alternatives[altIdx].values[critIdx] = parseFloat(e.target.value) || 0;
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    appState.criteria = structuredClone(DEFAULT_DATA.criteria);
    appState.alternatives = structuredClone(DEFAULT_DATA.alternatives);
    appState.result = null;
    renderInputTables();
    hideResults();
  });

  document.getElementById('btnCalculate').addEventListener('click', calculate);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
}

function calculate() {
  const weights = appState.criteria.map((c) => c.weight);
  const types = appState.criteria.map((c) => c.type);
  const matrix = appState.alternatives.map((a) => [...a.values]);
  const names = appState.alternatives.map((a) => a.name);
  const critLabels = appState.criteria.map((c) => c.id);

  try {
    const result = saw(matrix, weights, types);
    appState.result = { ...result, names, critLabels };
    renderCalculation();
    renderResults();
    navigateTo('hasil');
  } catch (err) {
    alert('Terjadi kesalahan: ' + err.message);
  }
}

function hideResults() {
  document.getElementById('calcEmpty').classList.remove('hidden');
  document.getElementById('calcContent').classList.add('hidden');
  document.getElementById('resultEmpty').classList.remove('hidden');
  document.getElementById('resultContent').classList.add('hidden');
}

function buildMatrixTable(matrix, names, critLabels) {
  const header = critLabels.map((c) => `<th>${c}</th>`).join('');
  const rows = matrix
    .map(
      (row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${names[i]}</strong></td>
        ${row.map((v) => `<td>${formatNumber(v)}</td>`).join('')}
      </tr>`
    )
    .join('');

  return `
    <table class="data-table">
      <thead>
        <tr><th>No</th><th>Mahasiswa</th>${header}</tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderCalculation() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('calcEmpty').classList.add('hidden');
  document.getElementById('calcContent').classList.remove('hidden');

  const matrix = appState.alternatives.map((a) => [...a.values]);

  document.getElementById('stepMatrix').innerHTML = buildMatrixTable(
    matrix, r.names, r.critLabels
  );

  document.getElementById('stepNormalized').innerHTML = buildMatrixTable(
    r.normalized, r.names, r.critLabels
  );

  const prefRows = r.ranking
    .map((item) => {
      const name = r.names[item.index];
      return `
        <tr>
          <td>${item.rank}</td>
          <td><strong>${name}</strong></td>
          <td>${formatNumber(item.preference)}</td>
        </tr>`;
    })
    .join('');

  document.getElementById('stepPreference').innerHTML = `
    <table class="data-table">
      <thead>
        <tr><th>Ranking</th><th>Mahasiswa</th><th>Nilai Preferensi (V<sub>i</sub>)</th></tr>
      </thead>
      <tbody>${prefRows}</tbody>
    </table>`;
}

function renderResults() {
  const r = appState.result;
  if (!r) return;

  document.getElementById('resultEmpty').classList.add('hidden');
  document.getElementById('resultContent').classList.remove('hidden');

  const winner = r.ranking[0];
  const winnerName = r.names[winner.index];

  document.getElementById('resultHero').innerHTML = `
    <div class="trophy">🎓</div>
    <h3>Prioritas Penerima Dispensasi</h3>
    <div class="winner">${winnerName}</div>
    <div class="score">Nilai Preferensi: ${formatNumber(winner.preference)}</div>`;

  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = r.ranking
    .map((item) => {
      const name = r.names[item.index];
      const rankClass = item.rank <= 3 ? `rank-${item.rank}` : 'rank-other';
      const status =
        item.rank <= 3
          ? '<span class="status-recommended">★ Layak Menerima</span>'
          : '<span class="status-normal">Dipertimbangkan</span>';

      return `
        <tr>
          <td><span class="rank-badge ${rankClass}">${item.rank}</span></td>
          <td><strong>${name}</strong></td>
          <td><strong>${formatNumber(item.preference)}</strong></td>
          <td>${status}</td>
        </tr>`;
    })
    .join('');

  const rankingText = r.ranking
    .map((item, idx) => `${idx + 1}. ${r.names[item.index]} (${formatNumber(item.preference)})`)
    .join(', ');

  document.getElementById('reportText').innerHTML = `
    <p>
      <strong>Laporan Keputusan — Penentuan Dispensasi Mahasiswa</strong>
    </p>
    <p>
      Berdasarkan perhitungan metode SAW dengan ${appState.criteria.length} kriteria
      (${appState.criteria.map((c) => c.name).join(', ')}) dan ${appState.alternatives.length} alternatif mahasiswa,
      sistem menghasilkan peringkat prioritas penerima dispensasi sebagai berikut:
    </p>
    <p><strong>${rankingText}</strong></p>
    <p>
      <strong>${winnerName}</strong> direkomendasikan sebagai prioritas utama dengan nilai preferensi tertinggi sebesar
      <strong>${formatNumber(winner.preference)}</strong>. Mahasiswa ini dinilai memiliki rasio Cost/Benefit yang paling sesuai dengan bobot kriteria kelayakan dispensasi.
    </p>
    <p style="font-size:0.85rem;color:var(--text-muted)">
      Dihasilkan oleh SPK Dispensasi Mahasiswa — Metode SAW | ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>`;
}