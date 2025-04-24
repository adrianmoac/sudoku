const blocksDistribution = {
  '00': 0,
  '10': 1,
  '20': 2,
  '01': 3,
  '11': 4,
  '21': 5,
  '02': 6,
  '12': 7,
  '22': 8
}

/**
 * Get shuffled array from 1-9
 * @returns 
 */
const getShuffledNumbers = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

/**
 * Get array with randomized coordinates of cells that will have a default value
 * @param {Number} fixedCellsNum The total number of fixed cells
 * @returns 
 */
const getFixedCells = (fixedCellsNum) => {
  const fixedCells = new Set();
  for(let i = 0; i < fixedCellsNum; i++) {
    while(true) {
      // num between 0 and 89, which are the total cells in the matrix
      let num = Math.floor(Math.random() * 90);
      if(num < 10) {
        num = '0' + String(num);
      } else {
        num = String(num);
      }
      if(!fixedCells.has(num)) {
        fixedCells.add(num)
        break;
      }
    }
  }
  return fixedCells
}

/**
 * Creates the sudoku
 * @param {boolean[] | number[]} grid 
 * @param {String[]} fixedCells Array with the fixed cells coordinates 
 * @param {Number} i rows 
 * @param {Number} j columns
 * @param {object} usedInRows Object with the numbers used in each row 
 * @param {object} usedInColumns Object with the numbers used in each column
 * @param {object} usedInBlock Object with the numbers used in each block
 * @returns 
 */
const fillGrid = (grid, fixedCells, i, j, usedInRows, usedInColumns, usedInBlock) => {
  // End of matrix
  if(i === 9) return grid;
  // Get block number
  const block = blocksDistribution[String(Math.floor(i / 3 || 0)) + String(Math.floor(j / 3 || 0))]

  const shuffledNumbers = getShuffledNumbers();
  for(let num = 0; num < 9; num++) {
    const number = shuffledNumbers[num]
    if ((!usedInRows[i] || !usedInRows[i][number]) && (!usedInColumns[j] || !usedInColumns[j][number]) && (!usedInBlock[block] || !usedInBlock[block][number])) {
      if (!usedInRows[i]) usedInRows[i] = [];
      if (!usedInColumns[j]) usedInColumns[j] = [];
      if (!usedInBlock[block]) usedInBlock[block] = [];
      // Add the number to the column, row and block
      usedInColumns[j][number] = true;
      usedInRows[i][number] = true;
      usedInBlock[block][number] = true;
      // Variable to get the coordinate of the current cell
      const fixedCell = String(i) + String(j);
      if(fixedCells.has(fixedCell)) {
        // Fixed cells have a f before the number
        grid[i][j] = 'f' + String(number);
        fixedCells.delete(fixedCell);
      } else {
        grid[i][j] = String(number);
      }

      let next;
      // If available columns in current row
      if(j < 8) {
        // Increment the column number for next recursive call
        next = fillGrid(grid, fixedCells, i, j + 1, usedInRows, usedInColumns, usedInBlock)
      } else {
        // Increment the row number and restart column for next recursive call
        next = fillGrid(grid, fixedCells, i + 1, 0, usedInRows, usedInColumns, usedInBlock)
      }

      // If the recursive call didn't reach an end delete the fixed cell
      if(next) {
        fixedCells.delete(String(i) + String(j))
        return next;
      }

      // Rollback if the recursive call didn't work
      fixedCells.add(fixedCell);
      usedInColumns[j][number] = false;
      usedInRows[i][number] = false;
      usedInBlock[block][number] = false;
      grid[i][j] = false;
    }

  }
  return false;
}

/**
 * Get complete sudoku matrix
 * @returns Complete matrix of the sudoku
 */
export const buildSudoku = () => {
  const fixedCells = getFixedCells(60);
  let solutionGrid = Array.from({length: 9}, () => Array(9).fill(false));
  solutionGrid = fillGrid(solutionGrid, fixedCells, 0, 0, {}, {}, {})
  return solutionGrid;
}