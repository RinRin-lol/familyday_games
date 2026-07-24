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
      "__other__": ["タップまたはクリック", "画面上のボタン", "キーボードの矢印キー", "マウス移動", "タップでジャンプ"]
    };
  
    // ゲームの種類が変更されたときの処理
    genreSelect.addEventListener("change", () => {
      const selectedGenre = genreSelect.value;
      const validControls = controlOptions[selectedGenre] || controlOptions["__other__"];
  
      // 操作方法の選択肢を更新
      controlSelect.innerHTML = "";
      validControls.forEach(control => {
        const option = document.createElement("option");
        option.textContent = control;
        option.value = control;
        controlSelect.appendChild(option);
      });
    });
  
    // ゲームの種類に応じた目標のプレースホルダーを設定
    genreSelect.addEventListener("change", () => {
      const selectedGenre = genreSelect.value;
      if (selectedGenre === "迷路ゲーム") {
        goalInput.placeholder = "例：ゴールにたどり着く";
      } else if (selectedGenre === "ジャンプゲーム") {
        goalInput.placeholder = "例：コインを集める";
      } else if (selectedGenre === "シューティング") {
        goalInput.placeholder = "例：敵を倒す";
      } else {
        goalInput.placeholder = "例：星、コイン、宝石、正解ポイント";
      }
    });
  });