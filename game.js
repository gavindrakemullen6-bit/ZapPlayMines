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
// Calculates payout multiplier based on revealed tiles and mine count
// Higher risk (more mines) = higher base multiplier
// Each safe tile revealed exponentially increases the multiplier
function getMultiplier() {
    const mines = parseInt(mineCountInput.value);
    const risk = mines / 25;

    // Slightly aggressive curve: base increases with risk
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

    // Validate inputs
    const betAmount = parseFloat(betInput.value);
    const mineCount = parseInt(mineCountInput.value);
    
    if (isNaN(betAmount) || betAmount < 0.01) {
        alert("Please enter a valid bet amount (minimum 0.01)");
        return;
    }
    
    if (isNaN(mineCount) || mineCount < 1 || mineCount > 24) {
        alert("Please enter a valid number of mines (1-24)");
        return;
    }

    gameActive = true;
    createBoard();
    placeMines();
    boardWrapEl.classList.add("spinning");

    // Disable inputs during game
    betInput.disabled = true;
    mineCountInput.disabled = true;
    cashoutBtn.disabled = true;
}

function reveal(i) {
    if (!gameActive) return;
    const tile = tiles[i];

    // Prevent clicking already-revealed tiles
    if (tile.classList.contains("safe") || tile.classList.contains("mine")) {
        return;
    }

    if (minePositions.includes(i)) {
        tile.classList.add("mine");
        tile.innerText = "💣";
        endGame(false);
        return;
    }

    tile.classList.add("safe");
    tile.innerText = "✓";
    revealedCount++;

    // Enable cashout after first safe reveal
    cashoutBtn.disabled = false;
}

function endGame(won) {
    gameActive = false;
    boardWrapEl.classList.remove("spinning");
    cashoutBtn.disabled = true;

    // Re-enable inputs
    betInput.disabled = false;
    mineCountInput.disabled = false;

    minePositions.forEach(pos => {
        if (!tiles[pos].classList.contains("safe")) {
            tiles[pos].classList.add("mine");
            tiles[pos].innerText = "💣";
        }
    });
}

function cashout() {
    if (!gameActive) return;
    const mult = getMultiplier();
    const betAmount = parseFloat(betInput.value);
    const payout = (betAmount * mult).toFixed(2);
    
    // Show payout in a more user-friendly way
    const message = `🎉 Cashout Successful!\n\nBet: $${betAmount.toFixed(2)}\nMultiplier: ${mult.toFixed(2)}x\nPayout: $${payout}`;
    alert(message);
    endGame(true);
}

function resetGame() {
    gameActive = false;
    boardWrapEl.classList.remove("spinning");
    revealedCount = 0;
    createBoard();
    
    // Re-enable inputs
    betInput.disabled = false;
    mineCountInput.disabled = false;
    cashoutBtn.disabled = true;
}

// ----------------------------
// BUTTON EVENTS
// ----------------------------
startBtn.onclick = startGame;
cashoutBtn.onclick = cashout;
resetBtn.onclick = resetGame;

// INIT
createBoard();
