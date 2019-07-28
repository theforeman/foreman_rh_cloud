import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './DashboardActions';
import reducer from './DashboardReducer';

import Dashboard from './Dashboard';
import {
  selectUploading,
  selectGenerating,
  selectPollingProcessID,
  selectActiveTab,
} from './DashboardSelectors';

// map state to props
const mapStateToProps = state => ({
  uploading: selectUploading(state),
  generating: selectGenerating(state),
  pollingProcessID: selectPollingProcessID(state),
  activeTab: selectActiveTab(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { dashboard: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
