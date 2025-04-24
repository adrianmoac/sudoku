import { buildSudoku } from "./buildSudoku.js";
import { buildGrid } from "./buildGrid.js";

const main = () => {
  const sudokuValues = buildSudoku();
  buildGrid(sudokuValues);
}

main();