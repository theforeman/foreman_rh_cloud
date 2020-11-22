import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../Components/AutoUploadSwitcher/AutoUploadSwitcherActions';
import InventoryAutoUpload from './InventoryAutoUpload';
import { selectAutoUploadEnabled } from '../../Components/AccountList/AccountListSelectors';
import { fetchAccountsStatus as fetchSettings } from '../../Components/AccountList/AccountListActions';

// map state to props
const mapStateToProps = state => ({
  autoUploadEnabled: selectAutoUploadEnabled(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actions, fetchSettings }, dispatch);

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InventoryAutoUpload);
