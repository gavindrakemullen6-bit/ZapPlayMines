# Stake Engine Integration

This repository includes a GitHub Actions workflow for running deterministic Stake Engine simulations on pull requests.

## Overview

The workflow automatically:
1. Sets up Node.js 18 and Python 3.10 environments
2. Installs dependencies (if package.json or requirements.txt exist)
3. Runs a deterministic simulation of the Mines game
4. Generates result.json artifact with comprehensive statistics
5. Uploads results as a GitHub Actions artifact
6. Posts results as a PR comment

## Files

- `.github/workflows/stake-engine.yml` - GitHub Actions workflow
- `tests/simulate_payouts.js` - Deterministic simulation script
- `.gitignore` - Excludes build artifacts and stake-engine-results

## Simulation Script

The `tests/simulate_payouts.js` script:
- Uses a seeded Mulberry32 PRNG for deterministic results
- Accepts `--seed` and `--bombs` command-line arguments
- Simulates 100 runs of the Mines game
- Calculates multipliers based on the game's math formula
- Outputs JSON with metadata, summary statistics, and example runs

### Usage

```bash
# Run with default seed and 8 bombs
node tests/simulate_payouts.js --seed "12345" --bombs 8

# Output is written to stdout in JSON format
node tests/simulate_payouts.js --seed "12345" --bombs 8 > results.json
```

### Parameters

- `--seed <string>` - Seed for deterministic random number generation (default: current timestamp)
- `--bombs <number>` - Number of mines/bombs on the 5x5 grid (must be 1-24, default: 8)

## Local Testing

```bash
# Test the simulation
mkdir -p stake-engine-results
node tests/simulate_payouts.js --seed "test123" --bombs 8 > stake-engine-results/result.json
cat stake-engine-results/result.json
```

## Workflow Triggers

The workflow runs on pull request events:
- opened
- synchronize (new commits pushed)
- reopened
- labeled

## Results Format

The result.json includes:
- `metadata` - Seed, bombs count, grid size, timestamp
- `summary` - Average revealed tiles, average multiplier, hit mine percentage
- `exampleMinePositions` - Positions of mines from the seeded generation
- `simulations` - First 10 simulation runs with detailed results

## Making the Check Required

1. Let the workflow run at least once to register the status check
2. Go to Settings → Branches → Branch protection rules
3. Add "Stake Engine validation" to required status checks
