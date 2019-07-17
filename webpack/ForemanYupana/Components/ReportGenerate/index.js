import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './ReportGenerateActions';
import reducer from './ReportGenerateReducer';

import ReportGenerate from './ReportGenerate';
import {
  selectLogs,
  selectProcessID,
  selectPollingProcessID,
  selectCompleted,
  selectLoading,
  selectExitCode,
} from './ReportGenerateSelectors';

// map state to props
const mapStateToProps = state => ({
  /** add state keys here */
  processID: selectProcessID(state),
  pollingProcessID: selectPollingProcessID(state),
  logs: selectLogs(state),
  completed: selectCompleted(state),
  loading: selectLoading(state),
  exitCode: selectExitCode(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { generating: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportGenerate);
