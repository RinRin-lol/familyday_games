document.addEventListener("DOMContentLoaded", () => {
    const genreSelect = document.getElementById("genre");
    const controlSelect = document.getElementById("control");
    const goalInput = document.getElementById("goalItem");

    // ゲームの種類に応じた操作方法の選択肢
    const controlOptions = {
        "ジャンプゲーム": ["タップでジャンプ", "キーボードの矢印キー"],
        "迷路ゲーム": ["キーボードの矢印キー", "マウス移動"],
        "シューティング": ["キーボードの矢印キー", "画面上のボタン"],
        "クイズゲーム": ["タップまたはクリック"],
        "クリック連打ゲーム": ["タップまたはクリック"],
        "宝探しゲーム": ["キーボードの矢印キー", "マウス移動"],
        "育成ゲーム": ["タップまたはクリック", "画面上のボタン"],
        "避けゲー": ["タップでジャンプ", "キーボードの矢印キー"],  
        "__other__": ["タップまたはクリック", "画面上のボタン", "キーボードの矢印キー", "マウス移動"]
    };

    const controlOptionsLowGrade = {
        "じゃんぷげーむ": ["たっぷで じゃんぷ", "きーぼーどの やじるしきー"],
        "めいろげーむ": ["きーぼーどの やじるしきー", "まうす いどう"],
        "しゅーてぃんぐ": ["きーぼーどの やじるしきー", "がめんじょうの ぼたん"],
        "くいずげーむ": ["たっぷ または くりっく"],
        "くりっくれんだげーむ": ["たっぷ または くりっく"],
        "たからさがしげーむ": ["きーぼーどの やじるしきー", "まうす いどう"],
        "いくせいげーむ": ["たっぷ または くりっく", "がめんじょうの ぼたん"],
        "よけげー": ["たっぷで じゃんぷ", "きーぼーどの やじるしきー"],
        "__other__": ["たっぷ または くりっく", "がめんじょうの ぼたん", "きーぼーどの やじるしきー", "まうす いどう"]
    };

    // 操作方法の選択肢を更新する関数
    function updateControlOptions() {
        const selectedGenre = genreSelect.value;
        const validControls = state.lowGrade
            ? controlOptionsLowGrade[selectedGenre] || controlOptionsLowGrade["__other__"]
            : controlOptions[selectedGenre] || controlOptions["__other__"];

        controlSelect.innerHTML = "";
        validControls.forEach(control => {
            const option = document.createElement("option");
            option.textContent = control;
            option.value = control;
            controlSelect.appendChild(option);
        });
    }

    // ゲームの種類が変更されたときの処理
    genreSelect.addEventListener("change", () => {
        updateControlOptions();
    });

    // 初期化時に操作方法を設定
    updateControlOptions();

    // 低学年モードの切り替えを監視
    document.getElementById("readingModeToggle").addEventListener("click", () => {
        updateControlOptions(); // 低学年モード切り替え時に操作方法を更新
    });
});
