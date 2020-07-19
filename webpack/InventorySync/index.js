import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './InventorySyncActions';
import InventorySync from './InventorySync';

// map state to props
const mapStateToProps = state => ({});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = {};

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(InventorySync);
