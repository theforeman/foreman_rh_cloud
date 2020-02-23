const tableHead = () => {
  const thead = document.createElement('th');
  thead.width = '25%';
  thead.innerText = 'Insights';
  return thead;
};

const tableData = data => {
  const td = document.createElement('td');
  td.className = 'ellipsis';
  td.innerHTML = `<span>${data}</span>`;
  return td;
};

export const adjustTableWithInsights = () => {
  const table = document.querySelector('#content > table');
  const thead = table.children[0];
  const tbody = table.children[1];
  const theadRow = thead.firstElementChild;
  const insightsTableIndex = 3;
  const refTH = theadRow.cells[insightsTableIndex];
  const insightsTH = tableHead();

  theadRow.insertBefore(insightsTH, refTH);

  const rows = [...tbody.children];
  rows.forEach((row, rowIndex) => {
    const hostName = row.cells[2].innerText.trim();
    const refTD = row.cells[insightsTableIndex];
    const insightsTD = tableData(hostName);
    tbody.children[rowIndex].insertBefore(insightsTD, refTD);
  });
};
