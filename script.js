
const grid = document.getElementById("grid");
const totalCells = 100;
let progress = JSON.parse(localStorage.getItem("studyProgress")) || [];

function createGrid() {
    // データ壊れ対策: progressが配列でなければリセット
    if (!Array.isArray(progress)) {
        progress = [];
        localStorage.removeItem("studyProgress");
    }
    grid.innerHTML = "";

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (progress[i]) {
            cell.style.backgroundColor = progress[i];
        }

        grid.appendChild(cell);
    }
}

function addStudyTime() {
    const hours = parseInt(document.getElementById("hours").value);
    const category = document.getElementById("category").value;

    if (!hours || hours <= 0) {
        alert("正しい学習時間を入力してください");
        return;
    }

    let gachaTriggered = false;
    for (let i = 0; i < hours; i++) {
        if (progress.length < totalCells) {
            progress.push(category);
            // 10マス進むごとにガチャを自動で引く
            if ((progress.length % GACHA_INTERVAL === 0) && (progress.length > getLastGachaProgress())) {
                triggerAutoGacha();
                gachaTriggered = true;
            }
        }
    }

    localStorage.setItem("studyProgress", JSON.stringify(progress));
    createGrid();
    if (gachaTriggered) {
        updateGachaUI();
    }
}

// 10マス進むごとに自動でガチャを引く関数
function triggerAutoGacha() {
    // ランダム画像選択
    const idx = Math.floor(Math.random() * gachaImages.length);
    const imgUrl = gachaImages[idx];
    // レアリティ決定
    const rarity = getRandomRarity();
    // 画像とラベルを重ねて表示
    gachaResult.innerHTML = `
        <div style="position:relative;display:inline-block;">
            <img src="${imgUrl}" alt="ガチャ画像" style="max-width:300px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #aaa;">
            <div style="position:absolute;left:0;top:0;padding:8px 18px 8px 8px;font-size:2em;font-weight:bold;color:white;background:${rarity.color};border-radius:8px 0 16px 0;opacity:0.92;text-shadow:1px 1px 4px #000;">
                ${rarity.label}
            </div>
        </div>
        <div style="margin-top:8px;color:#e6005c;font-weight:bold;">ガチャ自動発動！</div>
    `;
    // 今の進捗数を記録
    localStorage.setItem(GACHA_KEY, getCurrentProgressCount().toString());
}


function resetGrid() {
    if (confirm("進捗をリセットしますか？")) {
        progress = [];
        localStorage.removeItem("studyProgress");
        createGrid();
    }
}

createGrid();

// --- ガチャ機能 ---
const gachaBtn = document.getElementById("gacha-btn");
const gachaResult = document.getElementById("gacha-result");
const gachaTimer = document.getElementById("gacha-timer");

// 任意の画像URLリスト（必要に応じて追加・変更してください）
const gachaImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80", // 山
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80", // 海
    "https://images.unsplash.com/photo-1465378552210-977f0175b87d?auto=format&fit=crop&w=400&q=80", // 森
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80", // 夕焼け
    "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?auto=format&fit=crop&w=400&q=80"  // 花畑
];

// レアリティ設定
const rarities = [
    { label: "SSR", color: "#e6005c", percent: 10 },
    { label: "SR", color: "#ff9800", percent: 20 },
    { label: "R", color: "#2196f3", percent: 30 },
    { label: "NR", color: "#4caf50", percent: 25 },
    { label: "N", color: "#757575", percent: 25 }
];

function getRandomRarity() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const r of rarities) {
        sum += r.percent;
        if (rand < sum) return r;
    }
    return rarities[rarities.length - 1]; // 念のため
}


const GACHA_KEY = "lastGachaProgress";
const GACHA_INTERVAL = 10; // 10マスごと

function getCurrentProgressCount() {
    return progress.length;
}

function getLastGachaProgress() {
    return Number(localStorage.getItem(GACHA_KEY)) || 0;
}

function canDrawGacha() {
    // 前回ガチャから10マス進んでいればOK
    return getCurrentProgressCount() - getLastGachaProgress() >= GACHA_INTERVAL;
}

function getNextGachaProgress() {
    return getLastGachaProgress() + GACHA_INTERVAL;
}

function updateGachaUI() {
    if (canDrawGacha()) {
        gachaBtn.disabled = false;
        gachaTimer.textContent = "";
    } else {
        gachaBtn.disabled = true;
        const remain = getNextGachaProgress() - getCurrentProgressCount();
        gachaTimer.textContent = `あと${remain}マスでガチャが引けます`;
        // ガチャが引けない場合は画像を消す
        gachaResult.innerHTML = "";
    }
}

gachaBtn.addEventListener("click", () => {
    if (!canDrawGacha()) return;
    // ランダム画像選択
    const idx = Math.floor(Math.random() * gachaImages.length);
    const imgUrl = gachaImages[idx];
    // レアリティ決定
    const rarity = getRandomRarity();
    // 画像とラベルを重ねて表示
    gachaResult.innerHTML = `
        <div style="position:relative;display:inline-block;">
            <img src="${imgUrl}" alt="ガチャ画像" style="max-width:300px;max-height:200px;border-radius:8px;box-shadow:0 2px 8px #aaa;">
            <div style="position:absolute;left:0;top:0;padding:8px 18px 8px 8px;font-size:2em;font-weight:bold;color:white;background:${rarity.color};border-radius:8px 0 16px 0;opacity:0.92;text-shadow:1px 1px 4px #000;">
                ${rarity.label}
            </div>
        </div>
    `;
    // 今の進捗数を記録
    localStorage.setItem(GACHA_KEY, getCurrentProgressCount().toString());
    updateGachaUI();
});

// タイマーでUI更新
// 進捗追加時にもガチャUI更新
setInterval(updateGachaUI, 1000);
updateGachaUI();

// addStudyTimeの最後にもガチャUI更新
const origAddStudyTime = addStudyTime;
window.addStudyTime = function() {
    origAddStudyTime();
    updateGachaUI();
};




