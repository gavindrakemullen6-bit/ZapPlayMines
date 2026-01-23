# Stake Engine — Integration and Developer Notes

This repository includes a Stake Engine CI workflow and a sample Stake Engine configuration to run validation/tests for Stake Engine approval.

## Overview
- **Purpose**: Run Stake Engine validation and tests automatically on pull requests so Stake can review and approve with consistent results.
- **Stake Engine docs & SDK**: https://stakeengine.github.io/math-sdk/

## Files Added

### `.github/workflows/stake-engine.yml`
GitHub Actions workflow that runs on PRs. Contains placeholders that must be replaced with the exact Stake Engine install / run commands from Stake docs.

### `stake-engine.yml`
Example repository config for Stake Engine. Update keys/paths to the Stake Engine config format required by Stake.

### `docs/STAKE_ENGINE.md`
This file - documentation for Stake Engine integration.

### `tests/simulate_payouts.js`
Node.js script that simulates game outcomes to validate payout logic and RTP (Return to Player) calculations.

## How to Run Locally

### 1. Install Project Dependencies

**Frontend** (if `package.json` exists):
```bash
npm ci
```

**Python** (if `requirements.txt` exists):
```bash
python -m pip install -r requirements.txt
```

### 2. Install Stake Engine SDK/CLI

Follow installation steps at https://stakeengine.github.io/math-sdk/

Example (replace with real command):
```bash
pip install stake-engine-math-sdk
```

### 3. Run Local Simulation

Run the payout simulation to verify game math:
```bash
node tests/simulate_payouts.js
```

This will simulate thousands of game rounds with different configurations and output:
- Win rates
- Average multipliers
- RTP (Return to Player) percentages

### 4. Run Stake Engine Validation

Replace the example commands with Stake Engine CLI commands from their docs, for example:
```bash
python -m stake_engine.validate --config stake-engine.yml --output stake-engine-results/
```

## Making the Check Required

1. Let the workflow run at least once so it posts a status check name
2. Go to: **Settings → Branches → Branch protection rules**
3. Select: **Require status checks to pass**
4. Add the Stake Engine check to required checks

## Notes for Stake Reviewers

- The CI uploads validation artifacts to the PR (Stake Engine output files located under `stake-engine-results/`)
- If you prefer a different artifact format or a remote test server, update the workflow step `Run Stake Engine validation` to upload the required artifacts or call the Stake Engine remote endpoint

## Placeholders and Action Items

- [ ] Replace the placeholder install/run lines in `.github/workflows/stake-engine.yml` with the exact Stake Engine SDK/CLI commands from the Stake docs
- [ ] Confirm the required status check name — we can update the workflow job name if you prefer it to match your branch protection policy exactly
- [ ] Update `stake-engine.yml` with the correct configuration format required by Stake Engine

## Game Configuration

**ZapPlay Mines** is a minesweeper-style game with:
- 25 tiles (5×5 grid)
- Configurable mine count (1-24)
- Progressive multiplier system based on:
  - Number of mines selected
  - Number of safe tiles revealed
  
The multiplier formula uses an exponential curve that increases with risk and revealed tiles.
