import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './DashboardActions';
import reducer from './DashboardReducer';

import Dashboard from './Dashboard';
import { selectPollingProcessID } from './DashboardSelectors';

// map state to props
const mapStateToProps = state => ({
  pollingProcessID: selectPollingProcessID(state),
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
