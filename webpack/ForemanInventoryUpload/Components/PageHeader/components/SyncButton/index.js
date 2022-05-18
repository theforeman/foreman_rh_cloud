import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './SyncButtonActions';
import SyncButton from './SyncButton';
import { selectTaskStatus } from './SyncButtonSelectors';

// map state to props
const mapStateToProps = state => ({
  status: selectTaskStatus(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(SyncButton);
