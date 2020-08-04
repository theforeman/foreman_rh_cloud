import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import InsightsSettings from './InsightsSettings';
import { selectInsightsSyncEnabled } from './InsightsSettingsSelectors';
import * as actions from './InsightsSettingsActions';
import reducer from './InsightsSettingsReducer';

// map state to props
const mapStateToProps = state => ({
  insightsSyncEnabled: selectInsightsSyncEnabled(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(InsightsSettings);

// export reducers
export const reducers = { settings: reducer };
