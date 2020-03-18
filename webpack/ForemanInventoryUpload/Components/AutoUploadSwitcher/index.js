import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './AutoUploadSwitcherActions';
import AutoUploadSwitcher from './AutoUploadSwitcher';
import { selectIsAutoUpload } from '../AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  isAutoUpload: selectIsAutoUpload(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(AutoUploadSwitcher);
