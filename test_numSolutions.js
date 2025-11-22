// Load the Sudoku class
const {Sudoku} = require('./Sudoku.js');

// Minimal test: a simple puzzle with known solution count
// This is a puzzle with exactly 1 solution
const simple1 = [
  [5,3,0, 0,7,0, 0,0,0],
  [6,0,0, 1,9,5, 0,0,0],
  [0,9,8, 0,0,0, 0,6,0],

  [8,0,0, 0,6,0, 0,0,3],
  [4,0,0, 8,0,3, 0,0,1],
  [7,0,0, 0,2,0, 0,0,6],

  [0,6,0, 0,0,0, 2,8,0],
  [0,0,0, 4,1,9, 0,0,5],
  [0,0,0, 0,8,0, 0,7,9]
];

// This is a puzzle with multiple solutions
const multiple1 = [
  [5,3,0, 0,7,0, 0,0,0],
  [6,0,0, 8,9,5, 0,0,0],
  [0,9,1, 0,0,0, 0,6,0],

  [1,0,0, 0,6,0, 0,0,3],
  [4,0,0, 1,0,3, 0,0,8],
  [7,0,0, 0,2,0, 0,0,6],

  [0,6,0, 0,0,0, 2,1,0],
  [0,0,0, 4,8,9, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0]
];

// Very open puzzle
const open1 = [
  [1,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],

  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],

  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
  [0,0,0, 0,0,0, 0,0,0],
];

console.log('=== Test 1: Simple puzzle (should have 1 solution) ===');
const s1 = new Sudoku(simple1);
console.log('Default maxIterations:', s1.maxIterations);
console.log('isUnique?', s1.isUnique());
console.log('numSolutions:', s1.numSolutions());

console.log('=== Test 2: Simple puzzle (should have a few solutions) ===');
const m1 = new Sudoku(multiple1);
console.log('Default maxIterations:', m1.maxIterations);
console.log('isUnique?', m1.isUnique());
console.log('numSolutions:', m1.numSolutions());

console.log('\n=== Test 3: Very open puzzle (many solutions, will timeout) ===');
const s2 = new Sudoku(open1);
console.log('Default maxIterations:', s2.maxIterations);
console.log('isUnique?', s2.isUnique());
s2.maxIterations = 500000;
console.log('With maxIterations=500000: numSolutions:', s2.numSolutions());

console.log('\n=== Test 4: Open puzzle with stopAfter=2 (should be fast) ===');
const s3 = new Sudoku(open1);
console.log('numSolutions(stopAfter=2):', s3.numSolutions(2));


function ss(puzzle, options = {}) {
  const {mode =2, verbose = false} = options;
  // options = Object.assign({}, {mode: 2}, options);
  const s = new Sudoku(puzzle);
  if (!s.isValidPuzzle()) {
    console.log('Invalid puzzle: conflicts in given clues');
    return { status: 'invalid' };
  }

  console.log('Before:\n' + s.pPrint(mode));
  const result = s.solve();
  if (result === true) {
    console.log('\nSolved:\n' + s.pPrint(mode));
    //console.log('\Unique: ' + s.isUnique());
    console.log('\nNum solutions: ' + s.numSolutions());
    return { status: 'solved', grid: s.grid };
  } else if (result === null) {
    console.log('\nTimeout: puzzle took too long to solve (may be unsolvable)');
    console.log('Original:\n' + s.pPrint(mode));
    return { status: 'timeout' };
  } else {
    console.log('\nNo solution found');
    console.log('Original:\n' + s.pPrint(mode));
    return { status: 'no-solution' };
  }
}