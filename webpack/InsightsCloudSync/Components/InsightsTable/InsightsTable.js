/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import SelectAllAlert from './SelectAllAlert';
import { columns, actions } from './InsightsTableConstants';
import TableEmptyState from './components/EmptyState';
import {
  modifySelectedRows,
  getSortColumnIndex,
  getPerPageOptions,
} from './InsightsTableHelpers';
import './table.scss';

const InsightsTable = ({
  page,
  perPage: urlPerPage,
  status,
  sortBy,
  sortOrder,
  hits,
  query,
  itemCount,
  fetchInsights,
  onTableSetPage,
  onTablePerPageSelect,
  onTableSort,
  onTableSelect,
  selectedIds,
  showSelectAllAlert,
  selectAll,
  clearAllSelection,
  error,
  isAllSelected,
}) => {
  const { perPage: appPerPage } = useForemanSettings();
  const perPage = urlPerPage || appPerPage;

  // acts as componentDidMount
  useEffect(() => {
    fetchInsights({ page, perPage, query, sortBy, sortOrder });
  }, []);

  return (
    <React.Fragment>
      <SelectAllAlert
        itemCount={itemCount}
        selectedIds={selectedIds}
        showSelectAllAlert={showSelectAllAlert}
        selectAll={selectAll}
        clearAllSelection={clearAllSelection}
        isAllSelected={isAllSelected}
      />
      <Table
        aria-label="Recommendations Table"
        onSelect={(_event, isSelected, rowId) =>
          onTableSelect(_event, isSelected, rowId, hits, selectedIds)
        }
        canSelectAll
        sortBy={{ index: getSortColumnIndex(sortBy), direction: sortOrder }}
        onSort={onTableSort}
        cells={columns}
        rows={modifySelectedRows(hits, selectedIds)}
        actions={actions}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <TableEmptyState status={status} error={error} />
      <Pagination
        itemCount={itemCount}
        widgetId="recommendation-pagination"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={onTableSetPage}
        onPerPageSelect={onTablePerPageSelect}
        perPageOptions={getPerPageOptions(urlPerPage, appPerPage)}
      />
    </React.Fragment>
  );
};

InsightsTable.propTypes = {
  page: PropTypes.number,
  perPage: PropTypes.number,
  status: PropTypes.string,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.string,
  hits: PropTypes.array.isRequired,
  itemCount: PropTypes.number.isRequired,
  onTableSetPage: PropTypes.func.isRequired,
  onTablePerPageSelect: PropTypes.func.isRequired,
  onTableSort: PropTypes.func.isRequired,
  onTableSelect: PropTypes.func.isRequired,
  selectedIds: PropTypes.object,
  showSelectAllAlert: PropTypes.bool,
  selectAll: PropTypes.func.isRequired,
  clearAllSelection: PropTypes.func.isRequired,
  fetchInsights: PropTypes.func.isRequired,
  query: PropTypes.string,
  error: PropTypes.string,
  isAllSelected: PropTypes.bool,
};

InsightsTable.defaultProps = {
  page: 1,
  perPage: null,
  status: null,
  sortBy: '',
  sortOrder: '',
  selectedIds: {},
  showSelectAllAlert: false,
  query: '',
  error: '',
  isAllSelected: false,
};

export default InsightsTable;
