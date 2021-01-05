/* eslint-disable camelcase */
import React from 'react';
import {
  InsightsLabel,
  Section,
} from '@redhat-cloud-services/frontend-components';
import { columns } from './InsightsTableConstants';

export const mapResultsToRows = (results, selectedIds) => {
  if (results.length === 0) return [];

  return results.asMutable().map(({ id, hostname, title, total_risk }) => {
    const row = [
      hostname,
      title,
      <Section className="insights-total-risk" type="icon-group">
        <InsightsLabel value={total_risk} />
      </Section>,
    ];

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
