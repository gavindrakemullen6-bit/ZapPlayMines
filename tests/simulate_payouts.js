#!/usr/bin/env node

/**
 * Deterministic Stake simulation for ZapPlay Mines game
 * Produces a JSON result for artifact upload and PR comments
 */

// Parse command-line arguments
const args = process.argv.slice(2);
let seed = Date.now().toString();
let bombs = 8;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--seed' && i + 1 < args.length) {
    seed = args[i + 1];
    i++;
  } else if (args[i] === '--bombs' && i + 1 < args.length) {
    bombs = parseInt(args[i + 1]);
    i++;
  }
}

// Seeded random number generator (Mulberry32)
function createSeededRandom(seed) {
  let state = 0;
  for (let i = 0; i < seed.length; i++) {
    state = (state + seed.charCodeAt(i)) | 0;
  }
  
  return function() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Multiplier formula from game.js
function getMultiplier(revealedCount, mines) {
  const risk = mines / 25;
  const base = 1.18 + risk * 0.55;
  return Math.pow(base, revealedCount) * 0.99;
}

// Simulate placing mines on a 5x5 grid
function placeMines(random, mineCount) {
  const minePositions = [];
  while (minePositions.length < mineCount) {
    const pos = Math.floor(random() * 25);
    if (!minePositions.includes(pos)) {
      minePositions.push(pos);
    }
  }
  return minePositions;
}

// Run simulation
function runSimulation(seed, bombs) {
  const random = createSeededRandom(seed);
  const minePositions = placeMines(random, bombs);
  
  const simulations = [];
  const numRuns = 100;
  
  for (let run = 0; run < numRuns; run++) {
    const runRandom = createSeededRandom(seed + '-' + run);
    const runMines = placeMines(runRandom, bombs);
    
    let revealedCount = 0;
    let hitMine = false;
    const clickSequence = [];
    
    // Simulate random clicks until hitting a mine or revealing all safe tiles
    const maxReveals = 25 - bombs;
    for (let i = 0; i < 25 && revealedCount < maxReveals; i++) {
      const pos = Math.floor(runRandom() * 25);
      
      if (clickSequence.includes(pos)) continue;
      clickSequence.push(pos);
      
      if (runMines.includes(pos)) {
        hitMine = true;
        break;
      }
      
      revealedCount++;
    }
    
    const finalMultiplier = revealedCount > 0 ? getMultiplier(revealedCount, bombs) : 0;
    
    simulations.push({
      run: run + 1,
      revealed: revealedCount,
      hitMine: hitMine,
      multiplier: parseFloat(finalMultiplier.toFixed(4)),
      maxPossible: maxReveals
    });
  }
  
  // Calculate statistics
  const totalRevealed = simulations.reduce((sum, sim) => sum + sim.revealed, 0);
  const totalMultiplier = simulations.reduce((sum, sim) => sum + sim.multiplier, 0);
  const hitMineCount = simulations.filter(sim => sim.hitMine).length;
  
  return {
    metadata: {
      seed: seed,
      bombs: bombs,
      totalSimulations: numRuns,
      gridSize: 25,
      timestamp: new Date().toISOString()
    },
    summary: {
      averageRevealed: parseFloat((totalRevealed / numRuns).toFixed(2)),
      averageMultiplier: parseFloat((totalMultiplier / numRuns).toFixed(4)),
      hitMinePercentage: parseFloat((hitMineCount / numRuns * 100).toFixed(2)),
      maxPossibleReveals: 25 - bombs
    },
    exampleMinePositions: minePositions.sort((a, b) => a - b),
    simulations: simulations.slice(0, 10) // Include first 10 runs as examples
  };
}

// Run and output
const results = runSimulation(seed, bombs);
console.log(JSON.stringify(results, null, 2));
