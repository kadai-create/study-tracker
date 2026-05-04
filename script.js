
const grid = document.getElementById("grid");
const totalCells = 100;
let progress = JSON.parse(localStorage.getItem("studyProgress")) || [];

function createGrid() {
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

    for (let i = 0; i < hours; i++) {
        if (progress.length < totalCells) {
            progress.push(category);
        }
    }

    localStorage.setItem("studyProgress", JSON.stringify(progress));
    createGrid();
}

function resetGrid() {
    if (confirm("進捗をリセットしますか？")) {
        progress = [];
        localStorage.removeItem("studyProgress");
        createGrid();
    }
}

createGrid();




