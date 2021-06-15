import URI from 'urijs';
import { push } from 'connected-react-router';
import { get } from 'foremanReact/redux/API';
import { selectQueryParams } from './InsightsTableSelectors';
import { INSIGHTS_PATH } from '../../InsightsCloudSyncConstants';
import {
  columns,
  INSIGHTS_HITS_API_KEY,
  INSIGHTS_HITS_PATH,
  INSIGHTS_SET_SELECTED_IDS,
  INSIGHTS_SET_SELECT_ALL_ALERT,
  INSIGHTS_SET_SELECT_ALL,
} from './InsightsTableConstants';

export const fetchInsights = (queryParams = {}) => (dispatch, getState) => {
  const state = getState();
  const { page, perPage, query, sortBy, sortOrder, isSelectAll } = {
    ...selectQueryParams(state),
    ...queryParams,
  };

  const uri = new URI();
  uri.search({
    page,
    per_page: perPage,
    search: query,
    sort_by: sortBy,
    sort_order: sortOrder,
    select_all: isSelectAll,
  });

  dispatch(
    push({
      pathname: INSIGHTS_PATH,
      search: uri.search(),
    })
  );

  if (!isSelectAll) {
    dispatch(setSelectAllAlert(false));
  }

  return dispatch(
    get({
      key: INSIGHTS_HITS_API_KEY,
      url: INSIGHTS_HITS_PATH,
      params: {
        page,
        per_page: perPage,
        search: query,
        order: `${sortBy} ${sortOrder}`,
      },
      handleSuccess: response => {
        if (isSelectAll) {
          selectAllIds(dispatch, response.data.hits || []);
          dispatch(selectAll());
        }
      },
    })
  );
};

const selectAllIds = (dispatch, results, prevSelectedIds = {}) => {
  const selectedIds = { ...prevSelectedIds };
  results.forEach(row => {
    if (row.disableCheckbox) return;
    selectedIds[row.id] = true;
  });
  dispatch(selectByIds(selectedIds));
  dispatch(setSelectAllAlert(true));
};

export const setSelectAllAlert = showSelectAllAlert => ({
  type: INSIGHTS_SET_SELECT_ALL_ALERT,
  payload: { showSelectAllAlert },
});

export const selectByIds = selectedIds => ({
  type: INSIGHTS_SET_SELECTED_IDS,
  payload: { selectedIds },
});

export const setSelectAll = isAllSelected => dispatch => {
  dispatch(setSelectAllUrl(isAllSelected));
  dispatch({
    type: INSIGHTS_SET_SELECT_ALL,
    payload: { isAllSelected },
  });
};

export const selectAll = () => setSelectAll(true);

export const clearAllSelection = () => dispatch => {
  dispatch(selectByIds({}));
  dispatch(setSelectAllAlert(false));
  dispatch(setSelectAll(false));
};

export const onTableSort = (_event, index, direction) => {
  // The checkbox column shifts the data columns by 1;
  const { sortKey } = columns[index - 1];
  return fetchInsights({
    sortBy: sortKey,
    sortOrder: direction,
    page: 1,
  });
};

export const onTableSetPage = (_event, pageNumber) =>
  fetchInsights({ page: pageNumber });

export const onTablePerPageSelect = (_event, perPageNumber) =>
  fetchInsights({ perPage: perPageNumber });

export const onTableSelect = (
  isSelected,
  rowId,
  rows,
  prevSelectedIds
) => dispatch => {
  const handleRegularCheckbox = () => {
    const selectedIds = { ...prevSelectedIds };
    if (isSelected) {
      selectedIds[rows[rowId].id] = true;
    } else {
      dispatch(setSelectAllAlert(false));
      dispatch(setSelectAll(false));
      delete selectedIds[rows[rowId].id];
    }

    dispatch(selectByIds(selectedIds));
  };

  if (rowId === -1) {
    if (!isSelected) return dispatch(clearAllSelection());
    selectAllIds(dispatch, rows, prevSelectedIds);
  } else {
    handleRegularCheckbox();
  }

  return null;
};

const setSelectAllUrl = selectAllValue => dispatch => {
  const uri = new URI();
  uri.setSearch({ select_all: selectAllValue });

  dispatch(
    push({
      pathname: INSIGHTS_PATH,
      search: uri.search(),
    })
  );
};
