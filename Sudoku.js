// IDEA FOR PROJECT: Build a mini-game esque website, where I can code in javascript and implement
// inside of the website.
//Different minigames: Sudoku, Minesweeper, Connect 4, Hangman, Tic Tac Toe, crossword, 
// killer sudoku, kakuro? Snake, pong, etc?
//Specifically for Sudoku: 

//PHASE 2: Implement a way to save progress and load previous games.

//Add a multiplayer aspect to some games: include, e.g., chess, draughts, connect 4, pong, etc?
//Local multiplayer first, then online?

//Let the minigames be only a part of the site, also include: letter frequency analysis decoder tool
// - or basic encryption stuff, roman numeral converter, base converter, etc.

//Focus on making the site look nice and be responsive!

class Sudoku {
    constructor(grid) {
        this.grid = grid.map(row => row.slice());
        this.originalGrid = grid.map(row => row.slice()); // preserve original
        this.iterationCount = 0;
        this.maxIterations = 10000000; // timeout after ~1M iterations
    }

    getRow(r) {
      return this.grid[r].slice();
    }

    getCol(c) {
        return this.grid.map(row => row[c]);
    }

    getBox(r, c) { 
        const box = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                box.push(this.grid[(Math.floor(r / 3) * 3) + i][(Math.floor(c / 3) * 3) + j]);
            }
        }
        return box;
    }

    candidates(r, c) {
        if (this.grid[r][c] !== 0) return [];
        const possible = new Set([1,2,3,4,5,6,7,8,9]);
        this.getRow(r).forEach(v => possible.delete(v));
        this.getCol(c).forEach(v => possible.delete(v));
        this.getBox(r,c).forEach(v => possible.delete(v));
        return Array.from(possible);
    }

    isValid(r, c, val) {
      // Ensure val does not already appear in the same row, column or 3x3 box
      if (this.getRow(r).some(v => v === val)) return false;
      if (this.getCol(c).some(v => v === val)) return false;
      if (this.getBox(r, c).some(v => v === val)) return false;
      return true;
    }

    // Check if the initial puzzle is valid (no conflicts in given clues)
    isValidPuzzle() {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.grid[r][c] !== 0) {
            const val = this.grid[r][c];
            this.grid[r][c] = 0; // temporarily clear
            if (!this.isValid(r, c, val)) {
              this.grid[r][c] = val; // restore
              return false;
            }
            this.grid[r][c] = val; // restore
          }
        }
      }
      return true;
    }

    // Find an empty cell with fewest candidates.
    bestCell() { 
        let best = null;
        let bestCount = 10;
        for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (this.grid[r][c] === 0) {
            const cand = this.candidates(r,c);
            if (cand.length === 0) return {r,c,cand}; // dead end
            if (cand.length < bestCount) {
                bestCount = cand.length;
                best = {r, c, cand};
                if (bestCount === 1) return best; // only 1 candidate
            }
            }
        }
        }
        return best; // null if no empty cells
    }

  // Recursive solver with bestCell
  solve() {
    this.iterationCount++;
    if (this.iterationCount > this.maxIterations) {
      return null; // timeout
    }
    const cell = this.bestCell();
    if (!cell) return true; // solved
    const {r, c, cand} = cell;
    if (cand.length === 0) return false; // dead end
    for (const val of cand) {
      if (this.isValid(r, c, val)) {
        this.grid[r][c] = val;
        if (this.solve()) return true;
        this.grid[r][c] = 0;
      }
    }
    return false;
  }


  // Number of valid solutions
  numSolutions(stopAfter = null, iterationLimit = null) {
    // Run counting on a fresh copy of the original puzzle so calling 
    // numSolutions() after solve() still counts correctly.
    // - stopAfter: if a positive integer, stop as soon as that many solutions are found
    // - iterationLimit: if provided, temporarily override this.maxIterations
    const savedGrid = this.grid.map(row => row.slice());
    const savedIteration = this.iterationCount;
    const savedMax = this.maxIterations;

    this.grid = this.originalGrid.map(row => row.slice());
    this.iterationCount = 0;
    if (typeof iterationLimit === 'number') this.maxIterations = iterationLimit;
    const result = this.numSolutionsRecursive(stopAfter);

    // restore state
    this.grid = savedGrid.map(row => row.slice());
    this.iterationCount = savedIteration;
    this.maxIterations = savedMax;
    return result;
  }

  // Internal recursive counter that mutates `this.grid` while counting.
  numSolutionsRecursive(stopAfter = null) {
    this.iterationCount++;
    if (this.iterationCount > this.maxIterations) return null; // timeout

    const cell = this.bestCell();
    if (!cell) return 1; // solved => one solution found
    const {r, c, cand} = cell;
    if (cand.length === 0) return 0; // dead end => no solutions here

    let total = 0;
    for (const val of cand) {
      if (this.isValid(r, c, val)) {
        this.grid[r][c] = val;
        const res = this.numSolutionsRecursive(stopAfter);
        // propagate timeout (null) upward immediately
        if (res === null) {
          this.grid[r][c] = 0;
          return null;
        }
        total += res;
        this.grid[r][c] = 0;
        if (stopAfter && total >= stopAfter) return total;
      }
    }
    return total;
  }

  isUnique() {
    return this.numSolutions(2) === 1;
  }


  generateRandom() {
    // Generate a random completed Sudoku puzzle using backtracking with shuffled candidates
    // Returns true if successful, false if failed
    const cell = this.bestCell();
    if (!cell) return true; // all cells filled => solved
    
    const {r, c, cand} = cell;
    if (cand.length === 0) return false; // dead end
    
    // Shuffle candidates for randomness
    const shuffled = cand.sort(() => Math.random() - 0.5);
    
    for (const val of shuffled) {
      if (this.isValid(r, c, val)) {
        this.grid[r][c] = val;
        if (this.generateRandom()) return true;
        this.grid[r][c] = 0;
      }
    }
    return false;
  }

  generatePuzzle(difficulty = 'medium', options = {}) {
    // Generate a Sudoku puzzle with a unique solution by removing numbers from a completed grid
    // difficulty: 'easy' (40-45 clues), 'medium' (30-35 clues), 'hard' (17-25 clues)
    // options: { iterationLimit, symmetric, maxPasses }
    // Returns the puzzle grid

    const { iterationLimit = 2_000_000, symmetric = false, maxPasses = 3 } = options;

    // First, generate a random completed puzzle
    this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
    if (!this.generateRandom()) {
      console.warn('Failed to generate random Sudoku, using default');
      return this.grid;
    }

    // Save the completed puzzle
    const completed = this.grid.map(row => row.slice());
    this.originalGrid = completed.map(row => row.slice());

    // Determine how many clues to remove based on difficulty
    const clueCounts = {
      'easy': { min: 40, max: 45 },
      'medium': { min: 30, max: 35 },
      'hard': { min: 17, max: 25 }
    };
    const clueRange = clueCounts[difficulty] || clueCounts['medium'];
    const targetClues = Math.floor(Math.random() * (clueRange.max - clueRange.min + 1)) + clueRange.min;

    // Create a list of all cell positions and shuffle them
    const positions = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        positions.push({ r, c });
      }
    }

    // Multi-pass conservative removal: try multiple passes over shuffled positions
    let removed = 0;
    for (let pass = 0; pass < maxPasses && removed < 81 - targetClues; pass++) {
      positions.sort(() => Math.random() - 0.5);
      for (const { r, c } of positions) {
        if (removed >= 81 - targetClues) break;
        if (this.grid[r][c] === 0) continue;

        const backup = this.grid[r][c];
        // Remove the candidate cell (and symmetric partner if requested)
        this.grid[r][c] = 0;
        let symBackup = null;
        let symPos = null;
        if (symmetric) {
          const sr = 8 - r, sc = 8 - c;
          if (!(sr === r && sc === c) && this.grid[sr][sc] !== 0) {
            symBackup = this.grid[sr][sc];
            symPos = { sr, sc };
            this.grid[sr][sc] = 0;
          }
        }

        // Check uniqueness using a fresh instance to avoid interference with this.iterationCount
        const checkerGrid = this.grid.map(row => row.slice());
        const checker = new Sudoku(checkerGrid);
        checker.maxIterations = iterationLimit;
        const sols = checker.numSolutions(2);

        if (sols === 1) {
          // keep removal
          removed += 1 + (symPos ? 1 : 0);
        } else {
          // restore
          this.grid[r][c] = backup;
          if (symPos) this.grid[symPos.sr][symPos.sc] = symBackup;
        }
      }
    }

    // Update originalGrid to reflect the puzzle with removed clues
    this.originalGrid = this.grid.map(row => row.slice());
    return this.grid;
  }





  // Utility: print
  print() {
    return this.grid.map(row => row.map(n => n || '.').join(' ')).join('\n');
  }
  // Utility: pretty-print
  // For m=1: default; m=1, box off with blanks; m=2, box off with lines
  pPrint(m) {
    if (m === 0) return this.print()
    const lines = [];
    for (let r = 0; r < 9; r++) {
      if (m === 1 && r > 0 && r % 3 === 0) lines.push('');
      else if (m === 2 && r > 0 && r % 3 === 0)lines.push('------+-------+------');
      const rowStr = this.grid[r].map((n, c) => {
      const val = n || '.';
      if (m === 2 && c > 0 && c % 3 === 0) return '| ' + val;
      else if (m >= 1 && c > 0 && c % 3 === 0) return '  ' + val;
      else return val;      
    }).join(' ');
      lines.push(rowStr);
    }
    return lines.join('\n');
  }
}

// Export the Sudoku class
if (typeof module !== 'undefined' && module.exports) {
  module.exports.Sudoku = Sudoku;
}




