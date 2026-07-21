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

function value(id, fallback = '') {
  const node = document.getElementById(id);
  return node ? node.value.trim() || fallback : fallback;
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
  const genre = value('genre', 'ジャンプゲーム');
  const world = value('world', '宇宙');
  const heroName = value('heroName', '主人公キャラクター');
  const goalItem = value('goalItem', 'アイテム');
  const enemy = value('enemy', 'じゃまをするもの');
  const control = value('control', 'タップまたはクリック');
  const difficulty = value('difficulty', 'かんたん');
  const tone = value('tone', 'かわいい');

  return `HTML、CSS、JavaScriptを使って、ブラウザで遊べるシンプルなゲームを作ってください。

【作りたいゲーム】
・ゲームの種類：${genre}
・世界観：${world}
・主人公：${heroName}
・目的：${goalItem}を集める、または目標にする
・じゃまをするもの：${enemy}
・操作方法：${control}
・難しさ：${difficulty}
・見た目：${tone}

【必ず入れてほしい条件】
・iPadのブラウザでも遊びやすいようにしてください。
・操作ボタンや文字は大きめにしてください。
・スコアを表示してください。
・ゲームオーバー画面と「もう一度遊ぶ」ボタンを入れてください。
・まずはシンプルに動く完成版を作ってください。
・HTML、CSS、JavaScriptを1つのHTMLファイルにまとめてください。
・初心者にも分かるように、重要なところには短いコメントを入れてください。`;
}

function makeImprovePrompt() {
  const improveType = value('improveType', 'もっと面白くしたい');
  const goodPoint = value('goodPoint', '今のゲームの良いところ');
  const newIdea = value('newIdea', '追加したいアイデア');

  return `次のゲームを改良したいです。

【改良したいこと】
・${improveType}

【今のゲームで気に入っているところ】
・${goodPoint}

【追加したいアイデア】
・${newIdea}

【お願い】
・今のゲームの良いところはできるだけ残してください。
・iPadでも遊びやすいようにしてください。
・どこを変更したのか、初心者にも分かるように説明してください。
・修正版のコードは、HTML、CSS、JavaScriptを1つのHTMLファイルにまとめて出してください。
・もし機能を追加する場合は、ゲームが重くなりすぎないようにしてください。

このあと、現在のコードを貼ります。`;
}

function makeFixPrompt() {
  const trouble = value('trouble', '画面が真っ白');
  const troubleDetail = value('troubleDetail', '詳しい状況');

  return `HTML、CSS、JavaScriptで作ったゲームがうまく動きません。
初心者にも分かるように原因を説明し、修正版のコードを出してください。

【こまっていること】
・${trouble}

【くわしい状況】
・${troubleDetail}

【お願い】
・原因として考えられることを、分かりやすく説明してください。
・修正版は1つのHTMLファイルで動くようにしてください。
・iPadのブラウザでも動くようにしてください。
・修正した場所が分かるように、短いコメントを入れてください。

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

  document.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', generatePrompt);
    input.addEventListener('change', generatePrompt);
  });

  el.generate.addEventListener('click', generatePrompt);
  el.copy.addEventListener('click', copyPrompt);
  el.fillSample.addEventListener('click', fillSample);
}

bindEvents();
generatePrompt();
