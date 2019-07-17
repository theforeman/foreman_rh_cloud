import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './ReportUploadActions';
import reducer from './ReportUploadReducer';

import ReportUpload from './ReportUpload';
import {
  selectLogs,
  selectProcessID,
  selectPollingProcessID,
  selectCompleted,
  selectLoading,
  selectExitCode,
} from './ReportUploadSelectors';
import { selectFiles } from '../Dashboard/DashboardSelectors';

// map state to props
const mapStateToProps = state => ({
  /** add state keys here */
  processID: selectProcessID(state),
  pollingProcessID: selectPollingProcessID(state),
  logs: selectLogs(state),
  completed: selectCompleted(state),
  loading: selectLoading(state),
  exitCode: selectExitCode(state),
  files: selectFiles(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { uploading: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportUpload);
