import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './AutoUploadSwitcherActions';
import AutoUploadSwitcher from './AutoUploadSwitcher';
import { selectAutoUploadEnabled } from '../AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  autoUploadEnabled: selectAutoUploadEnabled(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(AutoUploadSwitcher);
