# ZapPlayMines

A browser-based Mines game with a modern UI and provably fair gameplay mechanics.

## 🎮 About

ZapPlayMines is a strategic betting game where players reveal tiles on a 5x5 grid while avoiding hidden mines. The more tiles you safely reveal, the higher your payout multiplier grows. Cash out before hitting a mine to win!

## 🚀 How to Play

1. **Set Your Bet**: Enter your bet amount (minimum $0.01)
2. **Choose Risk Level**: Select the number of mines (1-24). More mines = higher risk & rewards
3. **Start Game**: Click "Start Game" to begin
4. **Reveal Tiles**: Click tiles to reveal them. Safe tiles show ✓, mines show 💣
5. **Cash Out**: Click "Cashout" anytime to collect your winnings, or keep revealing for a higher multiplier
6. **Reset**: Start over with a new game

## 🎲 Game Rules

- **Grid**: 5x5 board (25 tiles total)
- **Mines**: Choose 1-24 mines
- **Multiplier**: Grows exponentially with each safe tile revealed
- **Winning**: Cash out before hitting a mine
- **Losing**: Hit a mine and lose your bet

## 🧮 Multiplier Formula

The payout multiplier is calculated based on:
- **Risk Level**: Number of mines divided by 25 (total tiles)
- **Safe Reveals**: Exponential growth with each revealed tile
- **Formula**: `(1.18 + risk * 0.55) ^ revealedCount * 0.99`

Higher risk (more mines) means a higher base multiplier, but also more danger!

## 🛠️ Running Locally

Simply open `index.html` in a modern web browser. No build tools or dependencies required!

```bash
# Clone the repository
git clone https://github.com/gavindrakemullen6-bit/ZapPlayMines.git
cd ZapPlayMines

# Open in browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

## 📁 Project Structure

```
ZapPlayMines/
├── index.html           # Main HTML structure
├── game.js              # Game logic and mechanics
├── style.css            # UI styling
├── stake-engine.yml     # Stake Engine configuration
├── .github/
│   └── workflows/
│       └── stake-engine.yml  # CI workflow
└── docs/
    └── STAKE_ENGINE.md  # Stake Engine integration docs
```

## 🔧 Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling with custom properties and animations
- **Vanilla JavaScript**: Game logic and DOM manipulation
- **No Dependencies**: Pure web technologies

## 📝 License

This project is open source and available for use and modification.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🎯 Features

- ✅ Real-time multiplier calculation
- ✅ Smooth 3D animations
- ✅ Input validation
- ✅ Prevents cheating (inputs disabled during gameplay)
- ✅ Responsive design
- ✅ Modern glassmorphism UI
- ✅ Stake Engine integration ready