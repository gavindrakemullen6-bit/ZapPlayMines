// ----------------------------
// ELEMENTS
// ----------------------------
const boardEl = document.getElementById("board");
const boardWrapEl = document.getElementById("boardWrap");

const betInput = document.getElementById("betInput");
const mineCountInput = document.getElementById("mineCount");

const startBtn = document.getElementById("startBtn");
const cashoutBtn = document.getElementById("cashoutBtn");
const resetBtn = document.getElementById("resetBtn");

let tiles = [];
let minePositions = [];
let revealedCount = 0;
let gameActive = false;

// ----------------------------
// MATH: MULTIPLIER FORMULA
// ----------------------------
function getMultiplier() {
    const mines = parseInt(mineCountInput.value);
    const risk = mines / 25;

    // Slightly aggressive curve
    const base = 1.18 + risk * 0.55;
    return Math.pow(base, revealedCount) * 0.99;
}

// ----------------------------
// BOARD GENERATION
// ----------------------------
function createBoard() {
    boardEl.innerHTML = "";
    tiles = [];
    revealedCount = 0;

    for (let i = 0; i < 25; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.index = i;

        tile.onclick = () => reveal(i);

        tiles.push(tile);
        boardEl.appendChild(tile);
    }
}

function placeMines() {
    minePositions = [];
    const mineCount = parseInt(mineCountInput.value);

    while (minePositions.length < mineCount) {
        let pos = Math.floor(Math.random() * 25);
        if (!minePositions.includes(pos)) minePositions.push(pos);
    }
}

// ----------------------------
// GAME FLOW
// ----------------------------
function startGame() {
    if (gameActive) return;

    gameActive = true;
    createBoard();
    placeMines();
    boardWrapEl.classList.add("spinning");

    cashoutBtn.disabled = true;
}

function reveal(i) {
    if (!gameActive) return;
    const tile = tiles[i];

    if (minePositions.includes(i)) {
        tile.classList.add("mine");
        endGame(false);
        return;
    }

    tile.classList.add("safe");
    tile.innerText = "✓";
    revealedCount++;

    cashoutBtn.disabled = false;
}

function endGame(won) {
    gameActive = false;
    boardWrapEl.classList.remove("spinning");

    minePositions.forEach(pos => {
        if (!tiles[pos].classList.contains("safe")) {
            tiles[pos].classList.add("mine");
            tiles[pos].innerText = "💣";
        }
    });
}

function cashout() {
    if (!gameActive) return;
    const mult = getMultiplier().toFixed(2);
    alert(`You cashed out at x${mult}!`);
    endGame(true);
}

function resetGame() {
    gameActive = false;
    boardWrapEl.classList.remove("spinning");
    revealedCount = 0;
    createBoard();
}

// ----------------------------
// BUTTON EVENTS
// ----------------------------
startBtn.onclick = startGame;
cashoutBtn.onclick = cashout;
resetBtn.onclick = resetGame;

// INIT
createBoard();
