const state = {
  mode: 'make',
};

const el = {
  modes: document.querySelectorAll('.mode'),
  sections: document.querySelectorAll('[data-section]'),
  formTitle: document.getElementById('formTitle'),
  formHelp: document.getElementById('formHelp'),
  output: document.getElementById('output'),
  generate: document.getElementById('generate'),
  copy: document.getElementById('copy'),
  copyStatus: document.getElementById('copyStatus'),
  fillSample: document.getElementById('fillSample'),
};

const modeTexts = {
  make: {
    title: '作りたいゲームを教えてください',
    help: 'まずは選ぶだけでOK。自由入力は分かるところだけで大丈夫です。',
  },
  improve: {
    title: '今あるゲームをどう改良したいですか？',
    help: '完成したゲームに追加したい機能や、もっと良くしたいところを整理します。',
  },
  fix: {
    title: 'こまっていることを教えてください',
    help: 'エラーや動かない原因をAIに相談するための文章を作ります。',
  },
};

const otherSelects = [
  { selectId: 'genre', otherId: 'genreOther' },
  { selectId: 'world', otherId: 'worldOther' },
  { selectId: 'control', otherId: 'controlOther' },
  { selectId: 'difficulty', otherId: 'difficultyOther' },
  { selectId: 'tone', otherId: 'toneOther' },
  { selectId: 'improveType', otherId: 'improveTypeOther' },
  { selectId: 'trouble', otherId: 'troubleOther' },
];

function value(id, fallback = '') {
  const node = document.getElementById(id);
  return node ? node.value.trim() || fallback : fallback;
}

function selectedValue(selectId, otherId, fallback = '') {
  const select = document.getElementById(selectId);
  if (!select) {
    return fallback;
  }

  if (select.value === '__other__') {
    return value(otherId, 'その他');
  }

  return select.value.trim() || fallback;
}

function syncOtherField(selectId, otherId) {
  const select = document.getElementById(selectId);
  const otherInput = document.getElementById(otherId);

  if (!select || !otherInput) {
    return;
  }

  const isOther = select.value === '__other__';
  otherInput.classList.toggle('hidden', !isOther);
  otherInput.disabled = !isOther;

  if (!isOther) {
    otherInput.value = '';
  }
}

function syncAllOtherFields() {
  otherSelects.forEach(({ selectId, otherId }) => {
    syncOtherField(selectId, otherId);
  });
}

function setMode(mode) {
  state.mode = mode;

  el.modes.forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });

  el.sections.forEach((section) => {
    section.classList.toggle('hidden', section.dataset.section !== mode);
  });

  el.formTitle.textContent = modeTexts[mode].title;
  el.formHelp.textContent = modeTexts[mode].help;
  generatePrompt();
}

function generatePrompt() {
  const generators = {
    make: makeGamePrompt,
    improve: makeImprovePrompt,
    fix: makeFixPrompt,
  };

  el.output.value = generators[state.mode]();
}

function makeGamePrompt() {
  const genre = selectedValue('genre', 'genreOther', 'ジャンプゲーム');
  const world = selectedValue('world', 'worldOther', '宇宙');
  const heroName = value('heroName', '主人公キャラクター');
  const goalItem = value('goalItem', 'アイテム');
  const enemy = value('enemy', 'じゃまをするもの');
  const control = selectedValue('control', 'controlOther', 'タップまたはクリック');
  const difficulty = selectedValue('difficulty', 'difficultyOther', 'かんたん');
  const tone = selectedValue('tone', 'toneOther', 'かわいい');

  return `# ゲーム制作プロンプト

HTML、CSS、JavaScriptを使って、ブラウザで遊べるシンプルなゲームを作ってください。

## 作りたいゲーム
- ゲームの種類: ${genre}
- 世界観: ${world}
- 主人公: ${heroName}
- 目的: ${goalItem}を集める、または目標にする
- じゃまをするもの: ${enemy}
- 操作方法: ${control}
- 難しさ: ${difficulty}
- 見た目: ${tone}

## 必ず入れてほしい条件
1. iPadのブラウザでも遊びやすいようにする。
2. 操作ボタンや文字は大きめにする。
3. スコアを表示する。
4. ゲームオーバー画面と「もう一度遊ぶ」ボタンを入れる。
5. まずはシンプルに動く完成版を作る。
6. HTML、CSS、JavaScriptを1つのHTMLファイルにまとめる。
7. 初心者にも分かるように、重要なところには短いコメントを入れる。`;
}

function makeImprovePrompt() {
  const improveType = selectedValue('improveType', 'improveTypeOther', 'もっと面白くしたい');
  const goodPoint = value('goodPoint', '今のゲームの良いところ');
  const newIdea = value('newIdea', '追加したいアイデア');

  return `# ゲーム改良プロンプト

次のゲームを改良したいです。

## 改良したいこと
- ${improveType}

## 今のゲームで気に入っているところ
- ${goodPoint}

## 追加したいアイデア
- ${newIdea}

## お願い
1. 今のゲームの良いところはできるだけ残してください。
2. iPadでも遊びやすいようにしてください。
3. どこを変更したのか、初心者にも分かるように説明してください。
4. 修正版のコードは、HTML、CSS、JavaScriptを1つのHTMLファイルにまとめて出してください。
5. 機能を追加する場合は、ゲームが重くなりすぎないようにしてください。

## 補足
このあと、現在のコードを貼ります。`;
}

function makeFixPrompt() {
  const trouble = selectedValue('trouble', 'troubleOther', '画面が真っ白');
  const troubleDetail = value('troubleDetail', '詳しい状況');

  return `# エラー相談プロンプト

HTML、CSS、JavaScriptで作ったゲームがうまく動きません。
初心者にも分かるように原因を説明し、修正版のコードを出してください。

## こまっていること
- ${trouble}

## くわしい状況
- ${troubleDetail}

## お願い
1. 原因として考えられることを、分かりやすく説明してください。
2. 修正版は1つのHTMLファイルで動くようにしてください。
3. iPadのブラウザでも動くようにしてください。
4. 修正した場所が分かるように、短いコメントを入れてください。

## 補足
このあと、現在のコードを貼ります。`;
}

function fillSample() {
  document.getElementById('genre').value = 'ジャンプゲーム';
  document.getElementById('world').value = '宇宙';
  document.getElementById('heroName').value = '宇宙ねこ';
  document.getElementById('goalItem').value = '星';
  document.getElementById('enemy').value = '隕石';
  document.getElementById('control').value = 'タップでジャンプ';
  document.getElementById('difficulty').value = 'かんたん';
  document.getElementById('tone').value = 'かわいい';
  syncAllOtherFields();
  setMode('make');
}

async function copyPrompt() {
  if (!el.output.value.trim()) {
    generatePrompt();
  }

  try {
    await navigator.clipboard.writeText(el.output.value);
    el.copyStatus.textContent = 'コピーしました！';
  } catch {
    el.output.select();
    document.execCommand('copy');
    el.copyStatus.textContent = 'コピーしました！';
  }

  setTimeout(() => {
    el.copyStatus.textContent = '';
  }, 1800);
}

function bindEvents() {
  el.modes.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });

  otherSelects.forEach(({ selectId, otherId }) => {
    const select = document.getElementById(selectId);
    if (!select) {
      return;
    }

    select.addEventListener('change', () => {
      syncOtherField(selectId, otherId);
      generatePrompt();
    });
  });

  document.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', generatePrompt);
    input.addEventListener('change', generatePrompt);
  });

  el.generate.addEventListener('click', generatePrompt);
  el.copy.addEventListener('click', copyPrompt);
  el.fillSample.addEventListener('click', fillSample);
}

bindEvents();
syncAllOtherFields();
generatePrompt();
