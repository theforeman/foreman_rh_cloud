import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './TerminalActions';
import reducer from './TerminalReducer';
import { selectLogs } from './TerminalSelectors';

import Terminal from './Terminal';

// map state to props
const mapStateToProps = state => ({
  logs: selectLogs(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { terminal: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Terminal);
