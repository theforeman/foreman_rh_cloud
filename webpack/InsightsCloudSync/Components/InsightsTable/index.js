import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './InsightsTableActions';
import InsightsTable from './InsightsTable';
import InsightsTableReducer from './InsightsTableReducer';
import {
  selectPage,
  selectPerPage,
  selectSearch,
  selectStatus,
  selectSortBy,
  selectSortOrder,
  selectHits,
  selectItemCount,
  selectSelectedIds,
  selectShowSelectAllAlert,
  selectError,
  selectIsAllSelected,
} from './InsightsTableSelectors';

// map state to props
const mapStateToProps = state => ({
  query: selectSearch(state),
  page: selectPage(state),
  perPage: selectPerPage(state),
  status: selectStatus(state),
  sortBy: selectSortBy(state),
  sortOrder: selectSortOrder(state),
  hits: selectHits(state),
  itemCount: selectItemCount(state),
  selectedIds: selectSelectedIds(state),
  showSelectAllAlert: selectShowSelectAllAlert(state),
  error: selectError(state),
  isAllSelected: selectIsAllSelected(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { table: InsightsTableReducer };

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(InsightsTable);
