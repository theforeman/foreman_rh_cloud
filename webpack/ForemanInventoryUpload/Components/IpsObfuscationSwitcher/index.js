import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './IpsObfuscationSwitcherActions';
import IpsObfuscationSwitcher from './IpsObfuscationSwitcher';
import { selectIpsObfuscationEnabled } from '../AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  ipsObfuscationEnabled: selectIpsObfuscationEnabled(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IpsObfuscationSwitcher);
