import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectCurrentOrganization } from 'foremanReact/components/Layout/LayoutSelectors';
import reducer from './InventoryFilterReducer';
import * as actions from './InventoryFilterActions';
import InventoryFilter from './InventoryFilter';
import { selectFilterTerm } from './InventoryFilterSelectors';

export const reducers = { inventoryFilter: reducer };

const mapStateToProps = state => ({
  filterTerm: selectFilterTerm(state),
  organization: selectCurrentOrganization(state),
});
// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(InventoryFilter);
