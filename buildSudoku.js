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

const getShuffledNumbers = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers;
}

const getFixedCells = (fixedCellsNum) => {
  const fixedCells = new Set();
  for(let i = 0; i < fixedCellsNum; i++) {
    while(true) {
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
const fillGrid = (grid, fixedCells, i, j, usedInRows, usedInColumns, usedInBlock) => {
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
      usedInColumns[j][number] = true;
      usedInRows[i][number] = true;
      usedInBlock[block][number] = true;
      const fixedCell = String(i) + String(j);
      if(fixedCells.has(fixedCell)) {
        grid[i][j] = 'f' + String(number);
        fixedCells.delete(fixedCell);
      } else {
        grid[i][j] = String(number);
      }

      let next;
      if(j < 8) {
        next = fillGrid(grid, fixedCells, i, j + 1, usedInRows, usedInColumns, usedInBlock)
      } else {
        next = fillGrid(grid, fixedCells, i + 1, 0, usedInRows, usedInColumns, usedInBlock)
      }

      if(next) {
        fixedCells.delete(String(i) + String(j))
        return next;
      }

      fixedCells.add(fixedCell);
      usedInColumns[j][number] = false;
      usedInRows[i][number] = false;
      usedInBlock[block][number] = false;
      grid[i][j] = false;
    }

  }
  return false;
}

const buildGrid = () => {
  const fixedCells = getFixedCells(60);
  let solutionGrid = Array.from({length: 9}, () => Array(9).fill(false));
  solutionGrid = fillGrid(solutionGrid, fixedCells, 0, 0, {}, {}, {})
  console.log(solutionGrid)
}

buildGrid()