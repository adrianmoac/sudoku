/**
 * Creates and inserts the sudoku grid to the HTML
 * @param {String[]} sudokuValues 
 */
export const buildGrid = (sudokuValues) => {
  let html = '';
  for(let i = 0; i < 9; i++) {
    // Verify if the row needs a darker bottom border meaning it's the end of the block
    html += `<tr class="table-row">`;
    for (let j = 0; j < 9; j++) {
      let fixedValue = '';
      let disabled = '';
      if(sudokuValues[i][j].startsWith('f')) {
        fixedValue = sudokuValues[i][j].split('f')[1]
        disabled = 'disabled'
      }
      let cellId = String(i * 9) + String(j);
      // Verify if the cell needs a darker right border, meaning it's the end of the block
      let bottomBorder = i === 2 || i === 5 ? 'bottom-border-cell' : ''
      let middleClass = (j === 2 || j === 5) ? 'right-border-cell' : '';
      html += `
        <td id="${cellId}" class="${middleClass} ${bottomBorder}">
          <input class="cell-input" value=${fixedValue || ''} ${disabled}>
        </td>
      `;
    }
    html += '</tr>';
  }

  document.getElementById("sudoku-table").innerHTML += html;
}