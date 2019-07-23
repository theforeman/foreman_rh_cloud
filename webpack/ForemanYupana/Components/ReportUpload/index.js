import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './ReportUploadActions';
import reducer from './ReportUploadReducer';

import ReportUpload from './ReportUpload';
import {
  selectLogs,
  selectProcessID,
  selectCompleted,
  selectLoading,
  selectExitCode,
  selectFiles,
  selectError,
} from './ReportUploadSelectors';

// map state to props
const mapStateToProps = state => ({
  /** add state keys here */
  processID: selectProcessID(state),
  logs: selectLogs(state),
  completed: selectCompleted(state),
  loading: selectLoading(state),
  exitCode: selectExitCode(state),
  files: selectFiles(state),
  error: selectError(state),
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
