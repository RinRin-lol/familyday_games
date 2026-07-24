const state = {
  mode: 'make',
  lowGrade: false,
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
  resetButton: document.getElementById('resetButton'),
  readingModeToggle: document.getElementById('readingModeToggle'),
  form: document.getElementById('promptForm'),
};

const modeTexts = {
  normal: {
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
  },
  kana: {
    make: {
      title: 'つくりたい げーむを おしえてね',
      help: 'まずは えらぶだけで OK。じゆうに かくのは わかるところだけで だいじょうぶ。',
    },
    improve: {
      title: 'いまある げーむを どう かいりょうしたい？',
      help: 'ついかしたい きのうや、もっと よくしたいところを せいりしよう。',
    },
    fix: {
      title: 'こまっていることを おしえてね',
      help: 'えらーや うごかない げんいんを AIに そうだんする ぶんしょうを つくるよ。',
    },
  },
};

const optionSets = {
  normal: {
    genre: ['ジャンプゲーム', '避けゲー', 'シューティング', '迷路ゲーム', 'クイズゲーム', 'クリック連打ゲーム', '宝探しゲーム', '育成ゲーム', { value: '__other__', label: 'その他' }],
    world: ['宇宙', '森', '海', '学校', 'おばけ屋敷', '未来都市', '雪山', 'お菓子の国', { value: '__other__', label: 'その他' }],
    control: ['タップまたはクリック', '画面上のボタン', 'キーボードの矢印キー', 'マウス移動', 'タップでジャンプ', { value: '__other__', label: 'その他' }],
    difficulty: ['かんたん', 'ふつう', '少しむずかしい', { value: '__other__', label: 'その他' }],
    tone: ['かわいい', 'かっこいい', 'レトロゲーム風', '明るくカラフル', 'シンプルで見やすい', { value: '__other__', label: 'その他' }],
    improveType: ['もっと面白くしたい', '難易度を上げたい', '難易度を下げたい', 'スコア機能を追加したい', '制限時間を追加したい', 'スマホ・iPadで遊びやすくしたい', '見た目を良くしたい', { value: '__other__', label: 'その他' }],
    trouble: ['画面が真っ白', 'ボタンが反応しない', 'キャラクターが動かない', 'iPadで操作しにくい', 'ゲームオーバーにならない', '画像や音が表示されない', { value: '__other__', label: 'その他' }],
  },
  kana: {
    genre: ['じゃんぷげーむ', 'よけげー', 'しゅーてぃんぐ', 'めいろげーむ', 'くいずげーむ', 'くりっくれんだげーむ', 'たからさがしげーむ', 'いくせいげーむ', { value: '__other__', label: 'そのた' }],
    world: ['うちゅう', 'もり', 'うみ', 'がっこう', 'おばけやしき', 'みらいとし', 'ゆきやま', 'おかしのくに', { value: '__other__', label: 'そのた' }],
    control: ['たっぷ または くりっく', 'がめんの ぼたん', 'きーぼーどの やじるしきー', 'まうすいどう', 'たっぷで じゃんぷ', { value: '__other__', label: 'そのた' }],
    difficulty: ['かんたん', 'ふつう', 'すこし むずかしい', { value: '__other__', label: 'そのた' }],
    tone: ['かわいい', 'かっこいい', 'れとろげーむふう', 'あかるく からふる', 'しんぷるで みやすい', { value: '__other__', label: 'そのた' }],
    improveType: ['もっと おもしろくしたい', 'なんいどを あげたい', 'なんいどを さげたい', 'すこあきのうを ついかしたい', 'せいげんじかんを ついかしたい', 'すまほ・iPadで あそびやすくしたい', 'みためを よくしたい', { value: '__other__', label: 'そのた' }],
    trouble: ['がめんが まっしろ', 'ぼたんが はんのうしない', 'きゃらくたーが うごかない', 'iPadで そうさしにくい', 'げーむおーばーに ならない', 'がぞうや おとが ひょうじされない', { value: '__other__', label: 'そのた' }],
  },
};

const labelTexts = {
  normal: {
    genre: 'ゲームの種類',
    world: '世界観',
    heroName: '主人公',
    goalItem: '集めるもの / 目標',
    enemy: 'じゃまをするもの',
    control: '操作方法',
    difficulty: '難しさ',
    tone: '見た目の雰囲気',
    improveType: '何を改良したい？',
    goodPoint: '今のゲームで気に入っているところ',
    newIdea: '追加したいアイデア',
    trouble: 'こまっていること',
    troubleDetail: 'くわしい状況',
  },
  kana: {
    genre: 'げーむの しゅるい',
    world: 'せかいかん',
    heroName: 'しゅじんこう',
    goalItem: 'あつめるもの / もくひょう',
    enemy: 'じゃまをするもの',
    control: 'そうさ ほうほう',
    difficulty: 'むずかしさ',
    tone: 'みための ふんいき',
    improveType: 'なにを かいりょうしたい？',
    goodPoint: 'いまの げーむで きにいっているところ',
    newIdea: 'ついかしたい あいであ',
    trouble: 'こまっていること',
    troubleDetail: 'くわしい じょうきょう',
  },
};

const placeholders = {
  normal: {
    genreOther: 'その他のゲームの種類を入力',
    worldOther: 'その他の世界観を入力',
    heroName: '例：宇宙ねこ、ロボット、勇者',
    goalItem: '例：星、コイン、宝石、正解ポイント',
    enemy: '例：隕石、おばけ、落とし穴',
    controlOther: 'その他の操作方法を入力',
    difficultyOther: 'その他の難しさを入力',
    toneOther: 'その他の見た目の雰囲気を入力',
    improveTypeOther: 'その他の改良内容を入力',
    goodPoint: '例：キャラクター、操作、音、背景',
    newIdea: '例：時間がたつと敵が速くなるようにしたい',
    troubleOther: 'その他のこまっていることを入力',
    troubleDetail: '例：コードを貼って実行したら、背景だけ表示されます',
    output: 'ここにプロンプトが表示されます',
  },
  kana: {
    genreOther: 'そのたの げーむの しゅるいを にゅうりょく',
    worldOther: 'そのたの せかいかんを にゅうりょく',
    heroName: 'れい：うちゅうねこ、ろぼっと、ゆうしゃ',
    goalItem: 'れい：ほし、こいん、ほうせき、せいかいぽいんと',
    enemy: 'れい：いんせき、おばけ、おとしあな',
    controlOther: 'そのたの そうさほうほうを にゅうりょく',
    difficultyOther: 'そのたの むずかしさを にゅうりょく',
    toneOther: 'そのたの みための ふんいきを にゅうりょく',
    improveTypeOther: 'そのたの かいりょうないようを にゅうりょく',
    goodPoint: 'れい：きゃらくたー、そうさ、おと、はいけい',
    newIdea: 'れい：じかんがたつと てきが はやくなるようにしたい',
    troubleOther: 'そのたの こまっていることを にゅうりょく',
    troubleDetail: 'れい：こーどを はって じっこうしたら、はいけいだけ ひょうじされます',
    output: 'ここに ぷろんぷとが ひょうじされます',
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

function setFieldLabel(controlId, labelText) {
  const control = document.getElementById(controlId);
  if (!control) {
    return;
  }

  const label = control.closest('label');
  if (!label) {
    return;
  }

  const textNode = Array.from(label.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0,
  );

  if (textNode) {
    textNode.textContent = `\n            ${labelText}\n            `;
  }
}

function setElementText(selector, text, useHtml = false) {
  const node = document.querySelector(selector);
  if (!node) {
    return;
  }

  if (useHtml) {
    node.innerHTML = text;
    return;
  }

  node.textContent = text;
}

function renderSelectOptions(lang) {
  Object.entries(optionSets[lang]).forEach(([selectId, options]) => {
    const select = document.getElementById(selectId);
    if (!select) {
      return;
    }

    const prevIndex = select.selectedIndex;
    select.innerHTML = '';

    options.forEach((optionDef) => {
      const option = document.createElement('option');
      if (typeof optionDef === 'string') {
        option.value = optionDef;
        option.textContent = optionDef;
      } else {
        option.value = optionDef.value;
        option.textContent = optionDef.label;
      }
      select.appendChild(option);
    });

    select.selectedIndex = Math.max(0, Math.min(prevIndex, options.length - 1));
  });
}

function applyReadingMode() {
  const lang = state.lowGrade ? 'kana' : 'normal';
  const onOffText = state.lowGrade ? 'ON' : 'OFF';

  document.body.classList.toggle('kana-mode', state.lowGrade);

  if (el.readingModeToggle) {
    el.readingModeToggle.textContent = state.lowGrade
      ? `🌱 ていがくねん もーど: ${onOffText}`
      : `🌱 低学年モード: ${onOffText}`;
    el.readingModeToggle.setAttribute('aria-pressed', state.lowGrade ? 'true' : 'false');
  }

  setElementText('#brandTitle', state.lowGrade ? 'FamilyDay げーむつくーる とくせつさいと' : 'FamilyDayゲームツクール特設サイト');
  setElementText('#navMakeGame', state.lowGrade ? 'AIで げーむを つくる' : 'AIでゲームを作る');
  setElementText('#navPlayGame', state.lowGrade ? 'つくった げーむで あそぶ' : '作ったゲームであそぶ');
  setElementText('#kickerText', state.lowGrade ? 'ぷろんぷとめーかー' : 'プロンプトメーカー');
  setElementText('#heroTitle', state.lowGrade ? 'げーむの あいであを、<br />AIに つたわる ぷろんぷとへ。' : 'ゲームのアイデアを、<br />AIに伝わるプロンプトへ。', true);
  setElementText('#heroLead', state.lowGrade ? 'しつもんに こたえるだけで、げーむせいさくようの ぷろんぷとを じどうで つくれます。' : '質問に答えるだけで、ゲーム制作用のプロンプトを自動で作れます。');
  setElementText('#cardAText', state.lowGrade ? 'しゅじんこう：うちゅうねこ' : '主人公：宇宙ねこ');
  setElementText('#cardBText', state.lowGrade ? 'そうさ：たっぷで じゃんぷ' : '操作：タップでジャンプ');
  setElementText('#cardCText', state.lowGrade ? 'せかいかん：おかしのくに' : '世界観：お菓子の国');
  setElementText('#previewPromptText', state.lowGrade ? 'HTML、CSS、JavaScriptを つかって、iPadで あそべる げーむを つくってください...' : 'HTML、CSS、JavaScriptを使って、iPadで遊べるゲームを作ってください...');

  setElementText('[data-mode="make"]', state.lowGrade ? '🎮 あたらしく つくる' : '🎮 新しく作る');
  setElementText('[data-mode="improve"]', state.lowGrade ? '🛠️ かいりょうする' : '🛠️ 改良する');
  setElementText('[data-mode="fix"]', state.lowGrade ? '🧯 えらー そうだん' : '🧯 エラー相談');

  const stepLabels = document.querySelectorAll('.panel-head .label');
  if (stepLabels[0]) {
    stepLabels[0].textContent = 'STEP 1';
  }
  if (stepLabels[1]) {
    stepLabels[1].textContent = 'STEP 2';
  }

  setElementText('.output-panel .panel-head h2', state.lowGrade ? 'できた ぷろんぷと' : 'できたプロンプト');
  setElementText('.output-panel .panel-head p', state.lowGrade ? 'こぴーして Google AI Studio に はりつけます。' : 'コピーして Google AI Studio に貼り付けます。');
  setElementText('#generate', state.lowGrade ? 'ぷろんぷとを つくる' : 'プロンプトを作る');
  setElementText('#resetButton', state.lowGrade ? 'にゅうりょくを りせっと' : '入力をリセット');
  setElementText('#fillSample', state.lowGrade ? 'おてほんを いれる' : 'お手本を入れる');
  setElementText('#copy', state.lowGrade ? 'こぴーする' : 'コピーする');

  setElementText('.hint-box strong', state.lowGrade ? 'こうざでの つかいかた' : '講座での使い方');
  const hintItems = document.querySelectorAll('.hint-box li');
  const hintTexts = state.lowGrade
    ? ['まず しつもんに こたえる', 'ぷろんぷとを こぴー', 'Google AI Studio に はる', 'うごいた げーむを かいりょうする']
    : ['まず質問に答える', 'プロンプトをコピー', 'Google AI Studio に貼る', '動いたゲームを改良する'];
  hintItems.forEach((item, index) => {
    if (hintTexts[index]) {
      item.textContent = hintTexts[index];
    }
  });

  const cardTitles = document.querySelectorAll('.info-card h3');
  const cardBodies = document.querySelectorAll('.info-card p');
  const cardTitleTexts = state.lowGrade
    ? ['さいしょは えらぶだけ', 'かいりょうも ぷろんぷとか', 'こまったときも そうだん']
    : ['最初は選ぶだけ', '改良もプロンプト化', '困った時も相談'];
  const cardBodyTexts = state.lowGrade
    ? [
      'じゆうに かくりょうを すくなくして、つくりたい げーむを かんがえるところから さぽーとします。',
      'いちど つくって おわりではなく、「もっと おもしろくする」ための おねがいぶんも つくれます。',
      'がめんが まっしろ、iPadで うごかない など、とらぶるそうだんようの ぶんしょうも つくれます。',
    ]
    : [
      '自由入力を少なくして、作りたいゲームを考えるところからサポートします。',
      '一度作って終わりではなく、「もっと面白くする」ためのお願い文も作れます。',
      '画面が真っ白、iPadで動かないなど、トラブル相談用の文章も作れます。',
    ];

  cardTitles.forEach((title, index) => {
    if (cardTitleTexts[index]) {
      title.textContent = cardTitleTexts[index];
    }
  });
  cardBodies.forEach((body, index) => {
    if (cardBodyTexts[index]) {
      body.textContent = cardBodyTexts[index];
    }
  });

  Object.entries(labelTexts[lang]).forEach(([controlId, labelText]) => {
    setFieldLabel(controlId, labelText);
  });

  Object.entries(placeholders[lang]).forEach(([inputId, text]) => {
    const node = document.getElementById(inputId);
    if (node) {
      node.setAttribute('placeholder', text);
    }
  });

  renderSelectOptions(lang);
  syncAllOtherFields();
  setMode(state.mode);
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

  const lang = state.lowGrade ? 'kana' : 'normal';
  el.formTitle.textContent = modeTexts[lang][mode].title;
  el.formHelp.textContent = modeTexts[lang][mode].help;
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
  const genre = selectedValue('genre', 'genreOther', state.lowGrade ? 'じゃんぷげーむ' : 'ジャンプゲーム');
  const world = selectedValue('world', 'worldOther', state.lowGrade ? 'うちゅう' : '宇宙');
  const heroName = value('heroName', state.lowGrade ? 'しゅじんこう きゃらくたー' : '主人公キャラクター');
  const goalItem = value('goalItem', state.lowGrade ? 'あいてむ' : 'アイテム');
  const enemy = value('enemy', state.lowGrade ? 'じゃまをするもの' : 'じゃまをするもの');
  const control = selectedValue('control', 'controlOther', state.lowGrade ? 'たっぷ または くりっく' : 'タップまたはクリック');
  const difficulty = selectedValue('difficulty', 'difficultyOther', 'かんたん');
  const tone = selectedValue('tone', 'toneOther', 'かわいい');

  if (state.lowGrade) {
    return `# げーむ せいさく ぷろんぷと

HTML、CSS、JavaScriptを つかって、ぶらうざで あそべる しんぷるな げーむを つくってください。

## つくりたい げーむ
- げーむの しゅるい: ${genre}
- せかいかん: ${world}
- しゅじんこう: ${heroName}
- もくてき: ${goalItem}を あつめる、または もくひょうにする
- じゃまをするもの: ${enemy}
- そうさほうほう: ${control}
- むずかしさ: ${difficulty}
- みため: ${tone}

## かならず いれてほしい じょうけん
1. iPadの ぶらうざでも あそびやすいようにする。
2. そうさぼたんや もじは おおきめにする。
3. すこあを ひょうじする。
4. げーむおーばー がめんと「もういちど あそぶ」ぼたんを いれる。
5. まずは しんぷるに うごく かんせいばんを つくる。
6. HTML、CSS、JavaScriptを 1つのHTMLふぁいるに まとめる。
7. しょしんしゃにも わかるように、たいせつなところへ みじかい こめんとを いれる。`;
  }

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
  const improveType = selectedValue('improveType', 'improveTypeOther', state.lowGrade ? 'もっと おもしろくしたい' : 'もっと面白くしたい');
  const goodPoint = value('goodPoint', state.lowGrade ? 'いまの げーむの よいところ' : '今のゲームの良いところ');
  const newIdea = value('newIdea', state.lowGrade ? 'ついかしたい あいであ' : '追加したいアイデア');

  if (state.lowGrade) {
    return `# げーむ かいりょう ぷろんぷと

つぎの げーむを かいりょうしたいです。

## かいりょうしたいこと
- ${improveType}

## いまの げーむで きにいっているところ
- ${goodPoint}

## ついかしたい あいであ
- ${newIdea}

## おねがい
1. いまの げーむの よいところは できるだけ のこしてください。
2. iPadでも あそびやすいように してください。
3. どこを へんこうしたのか、しょしんしゃにも わかるように せつめいしてください。
4. しゅうせいばんの こーどは、HTML、CSS、JavaScriptを 1つのHTMLふぁいるに まとめて だしてください。
5. きのうを ついかするばあいは、げーむが おもくなりすぎないように してください。

## ほそく
このあと、げんざいの こーどを はります。`;
  }

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
  const trouble = selectedValue('trouble', 'troubleOther', state.lowGrade ? 'がめんが まっしろ' : '画面が真っ白');
  const troubleDetail = value('troubleDetail', state.lowGrade ? 'くわしい じょうきょう' : '詳しい状況');

  if (state.lowGrade) {
    return `# えらー そうだん ぷろんぷと

HTML、CSS、JavaScriptで つくった げーむが うまく うごきません。
しょしんしゃにも わかるように げんいんを せつめいし、しゅうせいばんの こーどを だしてください。

## こまっていること
- ${trouble}

## くわしい じょうきょう
- ${troubleDetail}

## おねがい
1. げんいんとして かんがえられることを、わかりやすく せつめいしてください。
2. しゅうせいばんは 1つのHTMLふぁいるで うごくように してください。
3. iPadの ぶらうざでも うごくように してください。
4. しゅうせいした ばしょが わかるように、みじかい こめんとを いれてください。

## ほそく
このあと、げんざいの こーどを はります。`;
  }

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
  document.getElementById('genre').selectedIndex = 0;
  document.getElementById('world').selectedIndex = 0;
  document.getElementById('heroName').value = state.lowGrade ? 'うちゅうねこ' : '宇宙ねこ';
  document.getElementById('goalItem').value = state.lowGrade ? 'ほし' : '星';
  document.getElementById('enemy').value = state.lowGrade ? 'いんせき' : '隕石';
  document.getElementById('control').selectedIndex = 4;
  document.getElementById('difficulty').selectedIndex = 0;
  document.getElementById('tone').selectedIndex = 0;
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

  if (el.readingModeToggle) {
    el.readingModeToggle.addEventListener('click', () => {
      state.lowGrade = !state.lowGrade;
      applyReadingMode();
    });
  }

  if (el.form) {
    el.form.addEventListener('reset', () => {
      setTimeout(() => {
        syncAllOtherFields();
        generatePrompt();
      }, 0);
    });
  }
}

bindEvents();
applyReadingMode();
