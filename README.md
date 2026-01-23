# ZapPlayMines

A Mines-style game with Stake Engine integration for validation and approval.

## Project Structure

```
ZapPlayMines/
├── .github/workflows/
│   └── stake-engine.yml     # GitHub Actions workflow for Stake Engine validation
├── docs/
│   └── STAKE_ENGINE.md      # Stake Engine integration documentation
├── stake-engine.yml         # Stake Engine configuration
├── index.html               # Game UI
├── game.js                  # Game logic
└── style.css                # Game styling
```

## Stake Engine Integration

This repository is now properly configured for Stake Engine integration:

✅ **GitHub Actions workflow** is in the correct location (`.github/workflows/stake-engine.yml`)  
✅ **Configuration file** is at the root level (`stake-engine.yml`)  
✅ **Documentation** is organized in the docs folder (`docs/STAKE_ENGINE.md`)

### Next Steps

To complete the integration, you need to:
1. Replace the placeholder commands in `.github/workflows/stake-engine.yml` with actual Stake Engine SDK commands
2. Update `stake-engine.yml` with your specific game configuration
3. Follow the instructions in `docs/STAKE_ENGINE.md` for local testing

See [docs/STAKE_ENGINE.md](docs/STAKE_ENGINE.md) for detailed integration instructions.

## Running the Game

Open `index.html` in a web browser to play the game locally.