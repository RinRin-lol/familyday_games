const CONFIG = {
  SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSIogxpKcSqLtVo6nhfTxL7YKt0y78JjxQ7LANTz7BVNyL2jPDsxxJ6ug8tp6ZPfbFCWLzeztBMhlcH/pub?output=csv',
  FORM_URL: 'https://forms.gle/qHDZE21C1Tk58pfy8',
  REQUIRE_APPROVAL: true,
  USE_GAME_IFRAME_PREVIEW: false,
  COLUMNS: {
    title: ['ゲーム名'],
    author: ['ニックネーム'],
    grade: ['学年区分'],
    gameUrl: ['ゲームURL'],
    imageUrl: ['スクリーンショットURL'],
    comment: ['コメント'],
    status: ['公開可否'],
  },
};

const MACHINE_COLORS = [
  ['#ffd3dc', '#fff4d9', '#ff7ab6'],
  ['#cde8ff', '#97d7ff', '#ffcc66'],
  ['#f3f7fb', '#dbeafe', '#38bdf8'],
  ['#d7fff0', '#a7f3d0', '#34d399'],
];

const state = {
  games: [],
  filteredGames: [],
  isLoading: false,
};

const el = {
  grid: document.getElementById('arcadeGrid'),
  statusText: document.getElementById('statusText'),
  gameCount: document.getElementById('gameCount'),
  lastUpdated: document.getElementById('lastUpdated'),
  searchInput: document.getElementById('searchInput'),
  gradeFilter: document.getElementById('gradeFilter'),
  refreshButton: document.getElementById('refreshButton'),
  setupGuide: document.getElementById('setupGuide'),
  emptyState: document.getElementById('emptyState'),
  formLink: document.getElementById('formLink'),
  drawerFormLink: document.getElementById('drawerFormLink'),
  openMenu: document.getElementById('openMenu'),
  closeMenu: document.getElementById('closeMenu'),
  drawerBackdrop: document.getElementById('drawerBackdrop'),
  menuDrawer: document.getElementById('menuDrawer'),
  modal: document.getElementById('gameModal'),
  closeModal: document.getElementById('closeModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalAuthor: document.getElementById('modalAuthor'),
  modalGrade: document.getElementById('modalGrade'),
  modalComment: document.getElementById('modalComment'),
  gamePreview: document.getElementById('gamePreview'),
  playButton: document.getElementById('playButton'),
};

function init() {
  applyFormLinks();
  bindEvents();

  if (!CONFIG.SHEET_CSV_URL) {
    showSetupGuide();
    return;
  }

  loadGamesFromSheet();
}

function applyFormLinks() {
  const hasFormUrl = Boolean(CONFIG.FORM_URL);
  [el.formLink, el.drawerFormLink].forEach((link) => {
    link.href = hasFormUrl ? CONFIG.FORM_URL : '#';
    link.classList.toggle('disabled', !hasFormUrl);
    link.addEventListener('click', (event) => {
      if (!CONFIG.FORM_URL) {
        event.preventDefault();
        alert('app.js の CONFIG.FORM_URL にGoogleフォームのURLを設定してください。');
      }
    });
  });
}

function bindEvents() {
  el.searchInput.addEventListener('input', applyFilters);
  el.gradeFilter.addEventListener('change', applyFilters);
  el.refreshButton.addEventListener('click', loadGamesFromSheet);
  el.openMenu.addEventListener('click', openDrawer);
  el.closeMenu.addEventListener('click', closeDrawer);
  el.drawerBackdrop.addEventListener('click', closeDrawer);
  el.closeModal.addEventListener('click', () => el.modal.close());
}

function showSetupGuide() {
  el.setupGuide.classList.remove('hidden');
  el.emptyState.classList.add('hidden');
  el.statusText.textContent = 'CSV URLが未設定です。app.js の CONFIG.SHEET_CSV_URL を設定してください。';
  el.gameCount.textContent = '0';
}

async function loadGamesFromSheet() {
  if (state.isLoading) return;

  state.isLoading = true;
  el.refreshButton.disabled = true;
  el.statusText.textContent = 'スプレッドシートを読み込み中です...';
  el.setupGuide.classList.add('hidden');

  try {
    const response = await fetch(addCacheBuster(CONFIG.SHEET_CSV_URL), { cache: 'no-store' });
    if (!response.ok) throw new Error(`CSVを取得できませんでした: ${response.status}`);

    const csvText = await response.text();
    const rows = parseCsv(csvText);
    const games = rows.map(normalizeRow).filter(Boolean).filter(isPublished);

    console.log('CSV文字列:', csvText);
    console.log('CSV行データ:', rows);
    console.log('表示対象ゲーム:', games);

    state.games = games;
    applyFilters();
    el.statusText.textContent = `${games.length}件の公開ゲームを読み込みました。`;
    el.lastUpdated.textContent = formatTime(new Date());
  } catch (error) {
    console.error(error);
    el.statusText.textContent = '読み込みに失敗しました。CSV URL、公開設定、列名を確認してください。';
    el.emptyState.classList.remove('hidden');
  } finally {
    state.isLoading = false;
    el.refreshButton.disabled = false;
  }
}

function addCacheBuster(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cache=${Date.now()}`;
}

function parseCsv(csvText) {
  const text = csvText.replace(/^\ufeff/, '');
  const table = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== '')) table.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== '')) table.push(row);
  if (table.length < 2) return [];

  const headers = table[0].map((header) => header.trim());
  return table.slice(1).map((values) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : '';
    });
    return obj;
  });
}

function normalizeRow(row) {
  const title = getColumnValue(row, CONFIG.COLUMNS.title);
  const gameUrl = getColumnValue(row, CONFIG.COLUMNS.gameUrl);

  if (!title || !gameUrl) return null;

  return {
    title,
    author: getColumnValue(row, CONFIG.COLUMNS.author) || '参加者',
    grade: getColumnValue(row, CONFIG.COLUMNS.grade) || 'その他',
    gameUrl,
    imageUrl: normalizeDriveImageUrl(getColumnValue(row, CONFIG.COLUMNS.imageUrl)),
    comment: getColumnValue(row, CONFIG.COLUMNS.comment),
    status: getColumnValue(row, CONFIG.COLUMNS.status),
  };
}

function getColumnValue(row, candidates) {
  for (const name of candidates) {
    if (Object.prototype.hasOwnProperty.call(row, name) && row[name]) {
      return row[name].trim();
    }
  }
  return '';
}

function isPublished(game) {
  if (!CONFIG.REQUIRE_APPROVAL) return true;
  const status = String(game.status || '').trim().toLowerCase();
  return ['公開', 'ok', 'true', 'yes', '1', 'publish', 'published'].includes(status);
}

function applyFilters() {
  const keyword = el.searchInput.value.trim().toLowerCase();
  const grade = el.gradeFilter.value;

  state.filteredGames = state.games.filter((game) => {
    const matchesGrade = grade === 'all' || game.grade === grade;
    const matchesKeyword = `${game.title} ${game.author} ${game.comment}`.toLowerCase().includes(keyword);
    return matchesGrade && matchesKeyword;
  });

  renderGames();
}

function renderGames() {
  el.grid.innerHTML = '';
  el.gameCount.textContent = state.filteredGames.length;

  const hasData = state.filteredGames.length > 0;
  el.emptyState.classList.toggle('hidden', hasData);

  state.filteredGames.forEach((game, index) => {
    const card = document.createElement('article');
    const colors = MACHINE_COLORS[index % MACHINE_COLORS.length];
    card.className = 'machine-card';
    card.style.animationDelay = `${Math.min(index * 7, 245)}ms`;
    card.innerHTML = createMachineHtml(game, colors);
    card.querySelector('.screen').addEventListener('click', (event) => {
      event.preventDefault();
      openGameModal(game);
    });
    el.grid.appendChild(card);
  });
}

function createMachineHtml(game, colors) {
  const [cab1, cab2, cab3] = colors;
  const image = game.imageUrl
    ? `<img src="${escapeHtml(game.imageUrl)}" alt="${escapeHtml(game.title)}のスクリーンショット" loading="lazy" onerror="this.replaceWith(createPlaceholder())">`
    : '<div class="placeholder-screen">▶</div>';

  return `
    <div class="machine-wrap">
      <div class="cabinet" style="--cab1:${cab1}; --cab2:${cab2}; --cab3:${cab3};">
        <a class="screen" href="${escapeHtml(game.gameUrl)}" aria-label="${escapeHtml(game.title)}を開く">
          ${image}
        </a>
        <div class="controls">
          <span class="stick"></span>
          <span class="buttons"><i></i><i></i><i></i><i></i></span>
        </div>
      </div>
    </div>
    <div class="nameplate" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}</div>
    <span class="student">${escapeHtml(game.author)} / ${escapeHtml(game.grade)}</span>
  `;
}

function createPlaceholder() {
  const div = document.createElement('div');
  div.className = 'placeholder-screen';
  div.textContent = '▶';
  return div;
}

function openGameModal(game) {
  el.modalTitle.textContent = game.title;
  el.modalAuthor.textContent = `${game.author} / ${game.grade}`;
  el.modalGrade.textContent = game.grade;
  el.modalComment.textContent = game.comment || 'スクリーンショットを確認して、ゲームを開いて遊んでみましょう。';
  el.playButton.href = game.gameUrl;

  if (CONFIG.USE_GAME_IFRAME_PREVIEW) {
    el.gamePreview.innerHTML = `<iframe src="${escapeHtml(game.gameUrl)}" title="${escapeHtml(game.title)}"></iframe>`;
  } else if (game.imageUrl) {
    el.gamePreview.innerHTML = `<img src="${escapeHtml(game.imageUrl)}" alt="${escapeHtml(game.title)}のスクリーンショット">`;
  } else {
    el.gamePreview.innerHTML = '<div class="placeholder-screen">▶</div>';
  }

  el.modal.showModal();
}

function normalizeDriveImageUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  const fileId = extractGoogleDriveFileId(trimmed);
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : trimmed;
}

function extractGoogleDriveFileId(url) {
  const patterns = [
    /\/file\/d\/([^/]+)/,
    /[?&]id=([^&]+)/,
    /\/open\?id=([^&]+)/,
    /\/uc\?export=(?:download|view)&id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return decodeURIComponent(match[1]);
  }
  return '';
}

function openDrawer() {
  el.menuDrawer.classList.add('open');
  el.menuDrawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  el.menuDrawer.classList.remove('open');
  el.menuDrawer.setAttribute('aria-hidden', 'true');
}

function formatTime(date) {
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[char]));
}

window.createPlaceholder = createPlaceholder;
init();
