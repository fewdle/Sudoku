// Debug test for generatePuzzle
const {Sudoku} = require('./Sudoku.js');

console.log('=== Debug: generatePuzzle logic ===');
const s = new Sudoku(Array(9).fill(null).map(() => Array(9).fill(0)));
s.generateRandom();
console.log('Generated completed puzzle');

const completed = s.grid.map(row => row.slice());
s.originalGrid = completed.map(row => row.slice());

// Try removing just one clue and check
const testR = 0, testC = 0;
const backup = s.grid[testR][testC];
console.log(`\nTesting removal of cell [${testR}][${testC}] = ${backup}`);

s.grid[testR][testC] = 0;
s.iterationCount = 0;
const sols = s.numSolutions(2);
console.log(`After removal, numSolutions(2) = ${sols}`);
console.log(`sols === 1? ${sols === 1}`);
console.log(`Grid at [${testR}][${testC}] is now: ${s.grid[testR][testC]}`);

// Restore and check again
s.grid[testR][testC] = backup;
s.iterationCount = 0;
const sols2 = s.numSolutions(2);
console.log(`\nAfter restore, numSolutions(2) = ${sols2}`);
console.log(`sols2 === 1? ${sols2 === 1}`);
