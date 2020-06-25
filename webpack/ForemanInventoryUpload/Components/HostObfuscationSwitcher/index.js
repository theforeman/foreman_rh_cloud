import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './HostObfuscationSwitcherActions';
import HostObfuscationSwitcher from './HostObfuscationSwitcher';
import { selectHostObfuscationEnabled } from '../AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  hostObfuscationEnabled: selectHostObfuscationEnabled(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HostObfuscationSwitcher);
