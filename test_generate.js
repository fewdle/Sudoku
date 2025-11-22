// Test generateRandom and generatePuzzle
const {Sudoku} = require('./Sudoku.js');

console.log('=== Test 1: generateRandom ===');
const s1 = new Sudoku(Array(9).fill(null).map(() => Array(9).fill(0)));
console.log('Generating random completed puzzle...');
const result = s1.generateRandom();
console.log('Success:', result);
console.log('Puzzle grid (completed):');
console.log(s1.pPrint(2));
console.log('Is valid?', s1.isValidPuzzle());

console.log('\n=== Test 2: generatePuzzle (easy) ===');
const s2 = new Sudoku(Array(9).fill(null).map(() => Array(9).fill(0)));
console.log('Generating easy puzzle...');
s2.generatePuzzle('easy');
const clues2 = s2.grid.flat().filter(n => n !== 0).length;
console.log(`Clues in puzzle: ${clues2} (easy target: 40-45)`);
console.log(s2.pPrint(2));
// Create new instance with the generated puzzle for independent check
const s2_check = new Sudoku(s2.grid);
s2_check.maxIterations = 50_000_000;
const unique2 = s2_check.numSolutions(2);
console.log('numSolutions(2):', unique2);
console.log('Is unique?', unique2 === 1);

console.log('\n=== Test 3: generatePuzzle (medium) ===');
const s3 = new Sudoku(Array(9).fill(null).map(() => Array(9).fill(0)));
console.log('Generating medium puzzle...');
s3.generatePuzzle('medium');
const clues3 = s3.grid.flat().filter(n => n !== 0).length;
console.log(`Clues in puzzle: ${clues3} (medium target: 30-35)`);
console.log(s3.pPrint(2));
// Create new instance with the generated puzzle for independent check
const s3_check = new Sudoku(s3.grid);
s3_check.maxIterations = 50_000_000;
const unique3 = s3_check.numSolutions(2);
console.log('numSolutions(2):', unique3);
console.log('Is unique?', unique3 === 1);

console.log('\n=== Test 4: generatePuzzle (hard) ===');
const s4 = new Sudoku(Array(9).fill(null).map(() => Array(9).fill(0)));
console.log('Generating hard puzzle...');
s4.generatePuzzle('hard');
const clues4 = s4.grid.flat().filter(n => n !== 0).length;
console.log(`Clues in puzzle: ${clues4} (hard target: 17-25)`);
console.log(s4.pPrint(2));
// Create new instance with the generated puzzle for independent check
const s4_check = new Sudoku(s4.grid);
s4_check.maxIterations = 50_000_000;
const unique4 = s4_check.numSolutions(2);
console.log('numSolutions(2):', unique4);
console.log('Is unique?', unique4 === 1);
