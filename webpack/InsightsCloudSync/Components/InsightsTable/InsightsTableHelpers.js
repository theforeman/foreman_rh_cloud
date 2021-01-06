/* eslint-disable camelcase */
import { columns } from './InsightsTableConstants';

export const modifySelectedRows = (hits, selectedIds) => {
  if (hits.length === 0) return [];

  return hits.asMutable().map(({ id, hostname, title, total_risk }) => {
    const row = [hostname, title, total_risk];
    row.selected = selectedIds[id];
    return row;
  });
};

export const getSortColumnIndex = sortBy => {
  let colIndex = 0;
  columns.forEach((col, index) => {
    if (col.sortKey === sortBy) {
      // The checkbox column shifts the data columns by 1;
      colIndex = index + 1;
    }
  });
  return colIndex;
};

export const getPerPageOptions = perPage => {
  const options = new Set([
    { title: '5', value: 5 },
    { title: '10', value: 10 },
    { title: '15', value: 15 },
    { title: '25', value: 25 },
    { title: '50', value: 50 },
  ]);

  options.add({ title: `${perPage}`, value: perPage });
  return [...options].sort((a, b) => a.value - b.value);
};
