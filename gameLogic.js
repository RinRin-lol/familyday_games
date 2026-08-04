document.addEventListener("DOMContentLoaded", () => {
    const genreSelect = document.getElementById("genre");
    const controlSelect = document.getElementById("control");

    // ゲームの種類に応じた操作方法の選択肢
    const controlOptions = {
        "ジャンプゲーム": ["タップでジャンプ", "キーボードの矢印キー"],
        "迷路ゲーム": ["キーボードの矢印キー", "マウス移動"],
        "シューティング": ["キーボードの矢印キー", "画面上のボタン"],
        "クイズゲーム": ["タップまたはクリック"],
        "宝探しゲーム": ["キーボードの矢印キー", "マウス移動"],
        "レースゲーム": ["キーボードの矢印キー", "タップまたはクリック", "画面上のボタン"],
        "__other__": ["タップまたはクリック", "画面上のボタン", "キーボードの矢印キー", "マウス移動"]
    };

    const controlOptionsLowGrade = {
        "ジャンプゲーム": ["タップで じゃんぷ", "キーボードの やじるしキー"],
        "めいろゲーム": ["キーボードの やじるしキー", "マウスいどう"],
        "シューティング": ["キーボードの やじるしキー", "がめんの ボタン"],
        "クイズゲーム": ["タップ または クリック"],
        "たからさがしゲーム": ["キーボードの やじるしキー", "マウスいどう"],
        "レースゲーム": ["キーボードの やじるしキー", "タップ または クリック", "がめんの ボタン"],
        "__other__": ["タップ または クリック", "がめんの ボタン", "キーボードの やじるしキー", "マウスいどう"]
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

        if (typeof window.refreshSelectChoiceUi === "function") {
            window.refreshSelectChoiceUi();
        }
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

    document.getElementById("fillSample").addEventListener("click", () => {
        updateControlOptions();
    });

    document.getElementById("resetButton").addEventListener("click", () => {
        updateControlOptions();
    });
});
