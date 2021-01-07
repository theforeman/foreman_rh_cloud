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
  INSIGHTS_HIDE_SELECT_ALL_ALERT,
} from './InsightsTableConstants';

export const fetchInsights = (queryParams = {}) => (dispatch, getState) => {
  const { page, perPage, query, sortBy, sortOrder } = {
    ...selectQueryParams(getState()),
    ...queryParams,
  };

  dispatch(
    get({
      key: INSIGHTS_HITS_API_KEY,
      url: INSIGHTS_HITS_PATH,
      params: {
        page,
        per_page: perPage,
        search: query,
        order: `${sortBy} ${sortOrder}`,
      },
    })
  );

  const uri = new URI();
  uri.search({
    page,
    per_page: perPage,
    search: query,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  dispatch(
    push({
      pathname: INSIGHTS_PATH,
      search: uri.search(),
    })
  );

  dispatch(hideSelectAllAlert());
};

export const hideSelectAllAlert = () => ({
  type: INSIGHTS_HIDE_SELECT_ALL_ALERT,
});

export const selectByIds = (selectedIds = {}, showSelectAllAlert = false) => ({
  type: INSIGHTS_SET_SELECTED_IDS,
  payload: { selectedIds, showSelectAllAlert },
});

export const selectAll = () => (dispatch, getState) => {
  const { query } = { ...selectQueryParams(getState()) };

  const handleSuccess = response => {
    const selectedIds = {};
    response.data.hits.forEach(({ id }) => {
      selectedIds[id] = true;
    });
    dispatch(selectByIds(selectedIds, true));
  };
  dispatch(
    get({
      key: `${INSIGHTS_HITS_API_KEY}_ALL`,
      url: INSIGHTS_HITS_PATH,
      params: {
        search: query,
      },
      handleSuccess,
    })
  );
};

export const clearAllSelection = selectByIds; // passing nothing to `selectByIds` will clear all selection

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
  _event,
  isSelected,
  rowId,
  results,
  prevSelectedIds
) => dispatch => {
  const selectedIds = { ...prevSelectedIds };
  let showSelectAllAlert = false;
  // for select all
  if (rowId === -1) {
    if (!isSelected) return dispatch(clearAllSelection());

    results.forEach(row => {
      selectedIds[row.id] = true;
    });

    showSelectAllAlert = true;
  } else {
    isSelected
      ? (selectedIds[results[rowId].id] = true)
      : delete selectedIds[results[rowId].id];
  }

  return dispatch(selectByIds(selectedIds, showSelectAllAlert));
};
