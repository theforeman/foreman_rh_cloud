import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  selectAPIResponse,
  selectAPIStatus,
  selectAPIErrorMessage,
} from 'foremanReact/redux/API/APISelectors';
import * as actions from './RemediationActions';
import RemediationModal from './RemediationModal';
import { REMEDIATIONS_API_KEY } from './RemediationTableConstants';
import {
  selectExperimental,
  selectIsAllSelected,
  selectSearch,
  selectSelectedIds,
} from '../InsightsTable/InsightsTableSelectors';

// map state to props
const mapStateToProps = state => ({
  selectedIds: selectSelectedIds(state),
  remediations: selectAPIResponse(state, REMEDIATIONS_API_KEY).hits || [],
  status: selectAPIStatus(state, REMEDIATIONS_API_KEY),
  error: selectAPIErrorMessage(state, REMEDIATIONS_API_KEY),
  itemCount: selectAPIResponse(state, REMEDIATIONS_API_KEY).itemCount || 0,
  isAllSelected: selectIsAllSelected(state),
  query: selectSearch(state),
  isExperimentalMode: selectExperimental(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(RemediationModal);
