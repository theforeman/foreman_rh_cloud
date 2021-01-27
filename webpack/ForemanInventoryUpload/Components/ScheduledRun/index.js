import { connect } from 'react-redux';

import ScheduledRun from './ScheduledRun';
import { selectAutoUploadEnabled } from '../InventorySettings/InventorySettingsSelectors';

// map state to props
const mapStateToProps = state => ({
  autoUploadEnabled: selectAutoUploadEnabled(state),
});

// export connected component
export default connect(mapStateToProps)(ScheduledRun);
