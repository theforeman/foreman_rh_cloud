import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './InsightsCloudSyncActions';
import { fetchInsights } from './Components/InsightsTable/InsightsTableActions';
import InsightsCloudSync from './InsightsCloudSync';
import insightsCloudSyncReducers from './InsightsCloudSyncReducers';
import {
  selectSearch,
  selectHasToken,
} from './Components/InsightsTable/InsightsTableSelectors';
// map state to props
const mapStateToProps = state => ({
  query: selectSearch(state),
  hasToken: selectHasToken(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actions, fetchInsights }, dispatch);

// export reducers
export const reducers = insightsCloudSyncReducers;

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(InsightsCloudSync);
