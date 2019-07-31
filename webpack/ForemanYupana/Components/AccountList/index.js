import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './AccountListActions';
import reducer from './AccountListReducer';
import { selectBool } from './AccountListSelectors';

import AccountList from './AccountList';

// map state to props
const mapStateToProps = state => ({
  /** add state keys here */
  bool: selectBool(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { accountList: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountList);
