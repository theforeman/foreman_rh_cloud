/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import SelectAllAlert from './SelectAllAlert';
import { columns } from './InsightsTableConstants';
import TableEmptyState from '../../../common/table/EmptyState';
import { modifySelectedRows, getSortColumnIndex } from './InsightsTableHelpers';
import Pagination from './Pagination';
import './table.scss';

const InsightsTable = ({
  page,
  perPage: urlPerPage,
  status,
  sortBy,
  sortOrder,
  hits,
  query,
  fetchInsights,
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
  const [rows, setRows] = React.useState([]);

  // acts as componentDidMount
  useEffect(() => {
    fetchInsights({ page, perPage, query, sortBy, sortOrder });
  }, []);

  useEffect(() => {
    setRows(modifySelectedRows(hits, selectedIds, showSelectAllAlert));
  }, [hits, selectedIds]);

  return (
    <React.Fragment>
      <SelectAllAlert
        selectedIds={selectedIds}
        showSelectAllAlert={showSelectAllAlert}
        selectAll={selectAll}
        clearAllSelection={clearAllSelection}
        isAllSelected={isAllSelected}
      />
      <Table
        className="recommendations-table"
        aria-label="Recommendations Table"
        onSelect={(_event, isSelected, rowId) =>
          onTableSelect(isSelected, rowId, rows, selectedIds)
        }
        canSelectAll
        sortBy={{ index: getSortColumnIndex(sortBy), direction: sortOrder }}
        onSort={onTableSort}
        cells={columns}
        rows={rows}
        variant="compact"
      >
        <TableHeader />
        <TableBody />
      </Table>
      <TableEmptyState status={status} error={error} />
      <Pagination variant="bottom" />
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
