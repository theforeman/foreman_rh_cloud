import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './SyncButtonActions';
import reducer from './SyncButtonReducer';
import SyncButton from './SyncButton';
import { selectCloudToken } from '../../../InventorySettings/InventorySettingsSelectors';
import { selectStatus } from './SyncButtonSelectors';

// map state to props
const mapStateToProps = state => ({
  cloudToken: selectCloudToken(state),
  status: selectStatus(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export const reducers = { inventorySync: reducer };

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(SyncButton);
