/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  SortByDirection,
} from '@patternfly/react-table';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanSettings } from 'foremanReact/Root/Context/ForemanContext';
import SelectAllAlert from './SelectAllAlert';
import {
  columns as defaultColumns,
  getColumnsWithoutHostname,
} from './InsightsTableConstants';
import TableEmptyState from '../../../common/table/EmptyState';
import { modifySelectedRows, getSortColumnIndex } from './InsightsTableHelpers';
import Pagination from './Pagination';
import './table.scss';
import { useIopConfig } from '../../../common/Hooks/ConfigHooks';

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
  hideHost,
  hostname,
}) => {
  const { perPage: appPerPage } = useForemanSettings();
  const perPage = urlPerPage || appPerPage;
  const [rows, setRows] = React.useState([]);
  const [columns, setColumns] = React.useState(defaultColumns);

  // acts as componentDidMount
  useEffect(() => {
    fetchInsights({ page, perPage, query, sortBy, sortOrder });
  }, [hostname]);

  const isIop = useIopConfig();

  useEffect(() => {
    setRows(
      modifySelectedRows(hits, selectedIds, showSelectAllAlert, hideHost, isIop)
    );

    if (hideHost) setColumns(getColumnsWithoutHostname());
  }, [hits, selectedIds, hideHost]);

  const hasSelectableRows = rows.some(row => !row.disableCheckbox);
  const hasRows = rows.length > 0;
  const selectedRowsCount = rows.filter(
    row => !row.disableCheckbox && row.selected
  ).length;
  const selectableRowsCount = rows.filter(row => !row.disableCheckbox).length;
  const allSelected = hasRows && selectableRowsCount === selectedRowsCount;
  const isSortDirectionValid =
    sortOrder === SortByDirection.asc || sortOrder === SortByDirection.desc;
  const sortIndex = getSortColumnIndex(columns, sortBy);
  const sortByState = isSortDirectionValid
    ? {
        index: hasSelectableRows ? sortIndex + 1 : sortIndex,
        direction: sortOrder,
      }
    : undefined;

  const getCellContent = (row, col) => {
    if (col.id === 'actions') return col.formatter(row);
    const value = row[col.id];
    return col.formatter ? col.formatter(value) : value;
  };

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
        className="rh-cloud-recommendations-table"
        ouiaId="rh-cloud-recommendations-table"
        aria-label="Recommendations Table"
        variant="compact"
      >
        <Thead>
          <Tr>
            {hasSelectableRows && (
              <Th
                select={{
                  onSelect: (_event, isSelected) =>
                    onTableSelect(isSelected, -1, rows, selectedIds),
                  isSelected: allSelected,
                }}
              />
            )}
            {columns.map((column, index) => (
              <Th
                key={column.id}
                width={column.width}
                screenReaderText={!column.title ? __('Actions') : undefined}
                sort={
                  column.sortKey
                    ? {
                        sortBy: sortByState,
                        onSort: (_event, colIndex, direction) =>
                          onTableSort(columns, colIndex, direction),
                        columnIndex: hasSelectableRows ? index + 1 : index,
                      }
                    : undefined
                }
              >
                {column.title}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row, rowIndex) => (
            <Tr key={row.id}>
              {hasSelectableRows && (
                <Td
                  select={{
                    rowIndex,
                    isDisabled: row.disableCheckbox,
                    onSelect: (_event, isSelected) =>
                      onTableSelect(isSelected, rowIndex, rows, selectedIds),
                    isSelected: row.selected,
                  }}
                />
              )}
              {columns.map(column => (
                <Td key={`${row.id}-${column.id}`}>
                  {getCellContent(row, column)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
      <TableEmptyState status={status} error={error} rowsLength={rows.length} />
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
  hideHost: PropTypes.bool,
  hostname: PropTypes.string,
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
  hideHost: false,
  hostname: '',
};

export default InsightsTable;
