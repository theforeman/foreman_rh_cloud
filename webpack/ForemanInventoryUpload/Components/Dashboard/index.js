import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './DashboardActions';
import { restartProcess, restartDisconnected } from '../AccountList/AccountListActions';
import reducer from './DashboardReducer';

import Dashboard from './Dashboard';
import {
  selectUploading,
  selectGenerating,
  selectPollingProcessID,
  selectActiveTab,
  selectShowFullScreen,
} from './DashboardSelectors';

// map state to props
const mapStateToProps = (state, { accountID }) => ({
  uploading: selectUploading(state, accountID),
  generating: selectGenerating(state, accountID),
  pollingProcessID: selectPollingProcessID(state, accountID),
  activeTab: selectActiveTab(state, accountID),
  showFullScreen: selectShowFullScreen(state, accountID),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actions, restartProcess, restartDisconnected }, dispatch);

// export reducers
export const reducers = { dashboard: reducer };

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
