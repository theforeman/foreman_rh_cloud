import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleToggle as hostObfuscationToggle } from '../../../../Components/HostObfuscationSwitcher/HostObfuscationSwitcherActions';
import { handleToggle as ipsObfuscationToggle } from '../../../../Components/IpsObfuscationSwitcher/IpsObfuscationSwitcherActions';
import { handleToggle as excludePackagesToggle } from '../../../../Components/ExcludePackagesSwitcher/ExcludePackagesSwitcherActions';
import AdvancedSettings from './AdvancedSettings';
import {
  selectExcludePackages,
  selectHostObfuscationEnabled,
  selectIpsObfuscationEnabled,
} from '../../../../Components/AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  hostObfuscationEnabled: selectHostObfuscationEnabled(state),
  ipsObfuscationEnabled: selectIpsObfuscationEnabled(state),
  excludePackagesEnabled: selectExcludePackages(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { hostObfuscationToggle, ipsObfuscationToggle, excludePackagesToggle },
    dispatch
  );

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSettings);
