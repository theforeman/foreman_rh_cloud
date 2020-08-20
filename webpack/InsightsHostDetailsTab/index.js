import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InsightsTab from './InsightsTab';
import * as actions from './InsightsTabActions';
import reducer from './InsightsTabReducer';
import { selectHits } from './InsightsTabSelectors';

// map state to props
const mapStateToProps = state => ({
  hits: selectHits(state),
});

// map action dispatchers to props
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

// export reducers
export const hostInsightsReducers = { hostInsights: reducer };

// export connected component
export default connect(mapStateToProps, mapDispatchToProps)(InsightsTab);
