import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from './AccountListActions';
import reducer from './AccountListReducer';
import AccountList from './AccountList';
import {
  selectAccounts,
  selectPollingProcessID,
  selectError,
} from './AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  accounts: selectAccounts(state),
  pollingProcessID: selectPollingProcessID(state),
  error: selectError(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const reducers = { accountsList: reducer };

// export connected component
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountList);
