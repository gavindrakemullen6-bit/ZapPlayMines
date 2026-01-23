/**
 * Simulate Payouts for ZapPlay Mines
 * 
 * This script simulates game outcomes to validate the payout logic
 * and ensure that the RTP (Return to Player) is within expected bounds.
 */

// Multiplier formula from game.js
function getMultiplier(mines, revealedCount) {
    const risk = mines / 25;
    // Slightly aggressive curve
    const base = 1.18 + risk * 0.55;
    return Math.pow(base, revealedCount) * 0.99;
}

// Simulate a single game
function simulateGame(mineCount, revealTargets) {
    const BOARD_SIZE = 25;
    
    // Place mines randomly
    const minePositions = new Set();
    while (minePositions.size < mineCount) {
        const pos = Math.floor(Math.random() * BOARD_SIZE);
        minePositions.add(pos);
    }
    
    // Simulate reveals
    let revealedCount = 0;
    const availablePositions = Array.from({length: BOARD_SIZE}, (_, i) => i);
    
    for (let i = 0; i < revealTargets; i++) {
        if (availablePositions.length === 0) break;
        
        // Pick random position from available
        const randomIndex = Math.floor(Math.random() * availablePositions.length);
        const pos = availablePositions.splice(randomIndex, 1)[0];
        
        // Check if it's a mine
        if (minePositions.has(pos)) {
            // Hit a mine - lose bet
            return { won: false, multiplier: 0, revealedCount };
        }
        
        revealedCount++;
    }
    
    // Survived - calculate payout
    const multiplier = getMultiplier(mineCount, revealedCount);
    return { won: true, multiplier, revealedCount };
}

// Run simulation
function runSimulation(iterations = 10000, mineCount = 3, revealTargets = 5) {
    console.log(`\n=== Simulating ${iterations} games ===`);
    console.log(`Mines: ${mineCount}, Target reveals: ${revealTargets}\n`);
    
    let totalPayout = 0;
    let wins = 0;
    let losses = 0;
    let totalRevealedWhenWon = 0;
    
    for (let i = 0; i < iterations; i++) {
        const result = simulateGame(mineCount, revealTargets);
        
        if (result.won) {
            wins++;
            totalPayout += result.multiplier;
            totalRevealedWhenWon += result.revealedCount;
        } else {
            losses++;
            // Lost bet contributes 0 to payout
        }
    }
    
    const rtp = (totalPayout / iterations) * 100;
    const winRate = (wins / iterations) * 100;
    const avgMultiplier = wins > 0 ? totalPayout / wins : 0;
    const avgRevealed = wins > 0 ? totalRevealedWhenWon / wins : 0;
    
    console.log(`Results:`);
    console.log(`  Wins: ${wins} (${winRate.toFixed(2)}%)`);
    console.log(`  Losses: ${losses} (${(100 - winRate).toFixed(2)}%)`);
    console.log(`  Average multiplier (when won): ${avgMultiplier.toFixed(4)}x`);
    console.log(`  Average tiles revealed (when won): ${avgRevealed.toFixed(2)}`);
    console.log(`  RTP: ${rtp.toFixed(2)}%`);
    
    return { rtp, winRate, avgMultiplier, wins, losses };
}

// Main execution
if (require.main === module) {
    console.log("ZapPlay Mines - Payout Simulation");
    console.log("==================================");
    
    // Test different mine counts
    const testCases = [
        { mines: 1, reveals: 10 },
        { mines: 3, reveals: 5 },
        { mines: 5, reveals: 5 },
        { mines: 10, reveals: 3 },
        { mines: 15, reveals: 2 }
    ];
    
    console.log("\nRunning simulations for various configurations...\n");
    
    const results = [];
    for (const testCase of testCases) {
        const result = runSimulation(10000, testCase.mines, testCase.reveals);
        results.push({ ...testCase, ...result });
    }
    
    console.log("\n=== Summary ===");
    console.log("Configuration | Win Rate | RTP | Avg Mult");
    console.log("------------------------------------------------");
    results.forEach(r => {
        console.log(
            `${r.mines}M/${r.reveals}R        | ` +
            `${r.winRate.toFixed(1)}%   | ` +
            `${r.rtp.toFixed(1)}% | ` +
            `${r.avgMultiplier.toFixed(2)}x`
        );
    });
    
    console.log("\n✓ Simulation complete");
}

module.exports = { simulateGame, runSimulation, getMultiplier };
