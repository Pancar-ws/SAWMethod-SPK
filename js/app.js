/**
 * Pengendali UI Dashboard SPK Dispensasi
 */

let state = {
  criteria: structuredClone(DEFAULT_DATA.criteria),
  alternatives: structuredClone(DEFAULT_DATA.alternatives),
  result: null
};

document.addEventListener('DOMContentLoaded', () => {
  setupRouting();
  renderDashboardData();
  renderManageData();
  attachEventListeners();
});

function setupRouting() {
  const tabs = document.querySelectorAll('.nav-item');
  const toggle = document.getElementById('navToggle');
  const navBox = document.getElementById('mainNav');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.goto));
  });
  toggle.addEventListener('click', () => navBox.classList.toggle('open'));
}

function switchPage(pageId) {
  document.querySelectorAll('.view-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');
  document.getElementById('mainNav').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDashboardData() {
  document.getElementById('statCriteria').textContent = state.criteria.length;
  document.getElementById('statAlt').textContent = state.alternatives.length;

  document.getElementById('criteriaOverview').innerHTML = state.criteria.map(c => `
    <div class="param-card type-${c.type}">
      <span class="param-badge">${c.type.toUpperCase()}</span>
      <div class="param-id">${c.id}</div>
      <div class="param-name">${c.name}</div>
      <div class="param-weight">Bobot: ${(c.weight * 100).toFixed(0)}%</div>
    </div>
  `).join('');
}

function renderManageData() {
  // Render Tabel Bobot
  document.querySelector('#weightTable tbody').innerHTML = state.criteria.map((c, i) => `
    <tr>
      <td><strong>${c.id}</strong></td>
      <td>${c.name}</td>
      <td><span class="param-badge" style="position:static">${c.type.toUpperCase()}</span></td>
      <td><input type="number" step="0.01" value="${c.weight}" data-index="${i}" class="input-weight"></td>
      <td style="color:var(--text-muted); font-size:0.8rem;">${c.description}</td>
    </tr>
  `).join('');

  // Render Tabel Matriks
  const headCells = state.criteria.map(c => `<th>${c.id}<br><small style="font-weight:400">${c.name}</small></th>`).join('');
  document.querySelector('#matrixTable thead').innerHTML = `<tr><th>No</th><th>Identitas Mahasiswa</th>${headCells}</tr>`;

  document.querySelector('#matrixTable tbody').innerHTML = state.alternatives.map((alt, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${alt.name}</strong></td>
      ${alt.values.map((v, j) => `<td><input type="number" step="any" value="${v}" data-row="${i}" data-col="${j}" class="input-matrix"></td>`).join('')}
    </tr>
  `).join('');

  checkWeightSum();
}

function checkWeightSum() {
  const sum = state.criteria.reduce((acc, c) => acc + c.weight, 0);
  const badge = document.getElementById('weightTotal');
  badge.textContent = `Akumulasi: ${formatVal(sum, 2)}`;
  badge.style.color = Math.abs(sum - 1) > 0.01 ? 'var(--danger)' : 'var(--indigo-600)';
  badge.style.background = Math.abs(sum - 1) > 0.01 ? '#fee2e2' : 'var(--indigo-50)';
}

function attachEventListeners() {
  document.getElementById('weightTable').addEventListener('input', e => {
    if (e.target.classList.contains('input-weight')) {
      state.criteria[e.target.dataset.index].weight = parseFloat(e.target.value) || 0;
      checkWeightSum();
    }
  });

  document.getElementById('matrixTable').addEventListener('input', e => {
    if (e.target.classList.contains('input-matrix')) {
      state.alternatives[e.target.dataset.row].values[e.target.dataset.col] = parseFloat(e.target.value) || 0;
    }
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    if(confirm('Reset semua nilai matriks ke default awal?')){
      state = {
        criteria: structuredClone(DEFAULT_DATA.criteria),
        alternatives: structuredClone(DEFAULT_DATA.alternatives),
        result: null
      };
      renderManageData();
      hideOutput();
    }
  });

  document.getElementById('btnCalculate').addEventListener('click', executeSAW);
  document.getElementById('btnPrint').addEventListener('click', () => window.print());
}

function hideOutput() {
  document.getElementById('calcEmpty').classList.remove('hidden');
  document.getElementById('calcContent').classList.add('hidden');
  document.getElementById('resultEmpty').classList.remove('hidden');
  document.getElementById('resultContent').classList.add('hidden');
}

function buildGrid(matrix) {
  const headers = state.criteria.map(c => `<th>${c.id}</th>`).join('');
  const rows = matrix.map((row, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${state.alternatives[i].name}</strong></td>
      ${row.map(v => `<td>${formatVal(v)}</td>`).join('')}
    </tr>
  `).join('');
  return `<table class="styled-table"><thead><tr><th>No</th><th>Mahasiswa</th>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
}

function executeSAW() {
  const weights = state.criteria.map(c => c.weight);
  const types = state.criteria.map(c => c.type);
  const matrix = state.alternatives.map(a => [...a.values]);

  try {
    const res = processSAW(matrix, weights, types);
    state.result = res;
    
    // Render Perhitungan
    document.getElementById('calcEmpty').classList.add('hidden');
    document.getElementById('calcContent').classList.remove('hidden');
    document.getElementById('stepNormalized').innerHTML = buildGrid(res.normalizedMatrix);
    
    document.getElementById('stepPreference').innerHTML = `
      <table class="styled-table">
        <thead><tr><th>Rank</th><th>Mahasiswa</th><th>Skor Preferensi (V)</th></tr></thead>
        <tbody>
          ${res.ranking.map(item => `
            <tr>
              <td><span class="badge-rank">${item.rank}</span></td>
              <td><strong>${state.alternatives[item.index].name}</strong></td>
              <td>${formatVal(item.score)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    renderPodiumAndTable();
    switchPage('hasil');
  } catch(e) {
    alert('Gagal Komputasi: ' + e.message);
  }
}

function renderPodiumAndTable() {
  document.getElementById('resultEmpty').classList.add('hidden');
  document.getElementById('resultContent').classList.remove('hidden');

  const r = state.result.ranking;
  
  // Karena saat ini hanya ada 5 data, top 3 sangat relevan.
  // Jika kurang dari 3, kita handle agar tidak error.
  const top3 = [];
  if (r[1]) top3.push(r[1]); // Juara 2
  if (r[0]) top3.push(r[0]); // Juara 1
  if (r[2]) top3.push(r[2]); // Juara 3

  // Render Podium Visual
  document.getElementById('podiumArea').innerHTML = top3.map(item => {
    if (!item) return ''; 
    const realRank = item.rank;
    const name = state.alternatives[item.index].name;
    const initial = name.split(' ')[0]; // Ambil nama depan
    return `
      <div class="podium-box">
        <div class="podium-name">${initial}</div>
        <div class="podium-rank rank-${realRank}">
          <span style="font-size:1.5rem">#${realRank}</span>
          <div class="podium-score">${formatVal(item.score, 4)}</div>
        </div>
      </div>
    `;
  }).join('');

  // Render Main Ranking Table (Kuota 2 teratas disetujui, sisanya dipertimbangkan)
  const quota = 2;

  document.querySelector('#resultTable tbody').innerHTML = r.map(item => {
    const name = state.alternatives[item.index].name;
    const isPass = item.rank <= quota;
    const status = isPass ? '<span class="status-yes">Prioritas Utama</span>' : '<span class="status-no">Reguler / Dipertimbangkan</span>';

    return `
      <tr>
        <td><span class="badge-rank">${item.rank}</span></td>
        <td><strong>${name}</strong></td>
        <td>${formatVal(item.score, 4)}</td>
        <td>${status}</td>
      </tr>
    `;
  }).join('');
}