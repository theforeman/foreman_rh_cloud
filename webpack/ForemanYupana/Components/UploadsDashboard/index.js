import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './UploadsDashboardActions';
import reducer from './UploadsDashboardReducer';
import { selectBool } from './UploadsDashboardSelectors';

import UploadsDashboard from './UploadsDashboard';

// map state to props
const mapStateToProps = state => ({
  /** add state keys here */
  bool: selectBool(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { uploadsDashboard: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadsDashboard);
