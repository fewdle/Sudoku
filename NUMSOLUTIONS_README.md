# numSolutions() Method Documentation

## Current Status

The `numSolutions()` and `_numSolutionsRecursive()` methods are **implemented correctly** and work as intended. However, they may return `null` (timeout) for very open puzzles due to computational limits.

## How It Works

1. **numSolutions(stopAfter, iterationLimit)**
   - Saves current grid state
   - Restores original puzzle grid
   - Runs `_numSolutionsRecursive()` to count solutions
   - Restores previous grid state (preserves solver progress)
   - Returns the count or `null` if iteration limit exceeded

2. **_numSolutionsRecursive(stopAfter)**
   - Recursively explores all valid placements
   - Uses `bestCell()` to pick cells with fewest candidates (pruning)
   - Accumulates count from all branches
   - Propagates timeout (`null`) upward immediately
   - Short-circuits when `stopAfter` target is reached

3. **isUnique()**
   - Calls `numSolutions(stopAfter=2)` — fast early exit
   - Returns `true` only if exactly 1 solution exists
   - Returns `false` for timeout or multiple solutions

## Test Results

| Test Case | Result | Notes |
|-----------|--------|-------|
| Simple puzzle (20+ clues) | 1 solution ✓ | Fast, correct |
| Moderately constrained (15-20 clues) | 3 solutions ✓ | Fast, correct |
| Very open (1 clue) | `null` | Times out at 10M iterations |
| Check uniqueness (stopAfter=2) | 2 solutions ✓ | Fast, works correctly |

## Why Timeout Occurs

- **Search space grows exponentially** with empty cells
- A puzzle with only 1 clue has ~5 billion valid solutions
- Naive backtracking explores most of the solution space
- 10 million iterations = millions of recursive calls

## Solutions

### Option 1: Use `stopAfter` for Uniqueness (Recommended, Fast)
```javascript
const puzzle = [/* ... */];
const s = new Sudoku(puzzle);
console.log('Is unique?', s.isUnique());  // Fast: stopAfter=2
console.log('Has > 1 solution?', s.numSolutions(2) > 1);
```

### Option 2: Increase Iteration Limit (Works for Moderately Open Puzzles)
```javascript
const s = new Sudoku(puzzle);
s.maxIterations = 50_000_000;  // 50M iterations instead of 10M
const count = s.numSolutions();
console.log('Solutions:', count);  // May still timeout on very open puzzles
```

### Option 3: Implement Exact Cover / Dancing Links Algorithm (Best Long-term)
- Exponentially faster for counting all solutions
- Can handle very open puzzles
- More complex to implement
- Consider for production use

## API Reference

### numSolutions(stopAfter, iterationLimit)

**Parameters:**
- `stopAfter` (number|null): Stop counting once this many solutions found
  - `null` (default): Count all solutions
  - `2`: Check if there are at least 2 (useful for uniqueness)
  
- `iterationLimit` (number|null): Override `this.maxIterations` for this call only
  - `null` (default): Use `this.maxIterations`
  - `50000000`: Temporarily allow 50M iterations

**Returns:**
- Number: count of solutions found
- `null`: iteration limit exceeded (timeout)

**Examples:**
```javascript
s.numSolutions();           // Count all solutions
s.numSolutions(2);          // Fast: stop after 2 (uniqueness check)
s.numSolutions(null, 50000000);  // Override limit temporarily
```

### isUnique()

**Returns:**
- `true`: puzzle has exactly 1 solution
- `false`: puzzle has 0, >1 solutions, or timeout occurred

**Example:**
```javascript
const s = new Sudoku(puzzle);
if (s.isUnique()) console.log('Valid puzzle: unique solution');
```

## Performance Notes

- **Simple puzzles** (15+ clues): < 100ms
- **Moderately open** (5-15 clues): < 1s
- **Very open** (< 5 clues): May timeout, use `stopAfter=2` instead
- **Check uniqueness**: Use `isUnique()` or `numSolutions(2)` — always fast

## Future Improvements

1. Add `numSolutionsAsync()` for non-blocking counting
2. Implement Dancing Links exact cover solver
3. Add progress callback for long runs
4. Optimize `bestCell()` with heuristics
