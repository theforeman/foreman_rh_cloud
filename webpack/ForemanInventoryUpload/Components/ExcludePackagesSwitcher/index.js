import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './ExcludePackagesSwitcherActions';
import ExcludePackagesSwitcher from './ExcludePackagesSwitcher';
import { selectExcludePackages } from '../AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  excludePackages: selectExcludePackages(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExcludePackagesSwitcher);
