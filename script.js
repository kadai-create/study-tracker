// 1. 定数は一番上にまとめる
const grid = document.getElementById("grid");
const totalCells = 100;
const GACHA_KEY = "lastGachaProgress";
const GACHA_INTERVAL = 10; 
// ... 他のDOM要素取得など ...

// 2. グリッド作成
function createGrid() {
    // ... 既存のコード ...
}

// 3. 学習時間追加（updateGachaUIを中に組み込む）
function addStudyTime() {
    // ... 既存の計算処理 ...
    
    localStorage.setItem("studyProgress", JSON.stringify(progress));
    createGrid();
    updateGachaUI(); // ここで呼び出す
}

// 4. ガチャ関連の関数
function updateGachaUI() {
    // ... 既存のコード ...
}

// 5. 初回実行
createGrid();
updateGachaUI();

// ※末尾の「window.addStudyTime = ...」の部分は削除する



