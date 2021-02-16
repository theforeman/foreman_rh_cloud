import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setSetting } from '../../../../Components/InventorySettings/InventorySettingsActions';
import AdvancedSettings from './AdvancedSettings';
import {
  selectExcludePackages,
  selectHostObfuscationEnabled,
  selectIpsObfuscationEnabled,
} from '../../../../Components/InventorySettings/InventorySettingsSelectors';

// map state to props
const mapStateToProps = state => ({
  hostObfuscationEnabled: selectHostObfuscationEnabled(state),
  ipsObfuscationEnabled: selectIpsObfuscationEnabled(state),
  excludePackagesEnabled: selectExcludePackages(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setSetting }, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSettings);
