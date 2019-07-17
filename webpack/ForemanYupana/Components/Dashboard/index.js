import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './DashboardActions';
import reducer from './DashboardReducer';
import { selectBool } from './DashboardSelectors';

import Dashboard from './Dashboard';

// map state to props
const mapStateToProps = state => ({
  /** add state keys here */
  bool: selectBool(state),
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
