import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  getSettings,
  setSetting,
} from '../../Components/InventorySettings/InventorySettingsActions';
import InventoryAutoUpload from './InventoryAutoUpload';
import { selectAutoUploadEnabled } from '../../Components/InventorySettings/InventorySettingsSelectors';

// map state to props
const mapStateToProps = state => ({
  autoUploadEnabled: selectAutoUploadEnabled(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setSetting, getSettings }, dispatch);

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InventoryAutoUpload);
