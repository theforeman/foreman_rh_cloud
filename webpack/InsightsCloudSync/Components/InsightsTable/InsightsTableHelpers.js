/* eslint-disable camelcase */
import { columns } from './InsightsTableConstants';

export const modifySelectedRows = (hits, selectedIds, showSelectAllAlert) => {
  if (hits.length === 0) return [];

  return hits
    .asMutable()
    .map(({ id, hostname, title, total_risk, has_playbook }) => {
      const disableCheckbox = !has_playbook;
      return {
        cells: [hostname, title, total_risk, has_playbook],
        disableCheckbox,
        id,
        /** The main table checkbox will be seen as selected only if all rows are selected,
         * in this case we need to select also the disabled once and hide it with css */
        selected: selectedIds[id] || (disableCheckbox && showSelectAllAlert),
      };
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

export const getPerPageOptions = (urlPerPage, appPerPage) => {
  const initialValues = new Set([5, 10, 15, 25, 50]);
  initialValues.add(appPerPage);
  urlPerPage && initialValues.add(urlPerPage);
  const options = [...initialValues].sort((a, b) => a - b);
  return options.map(value => ({ title: value.toString(), value }));
};
