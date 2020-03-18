import { connect } from 'react-redux';

import ScheduledRun from './ScheduledRun';
import { selectIsAutoUpload } from '../AccountList/AccountListSelectors';

// map state to props
const mapStateToProps = state => ({
  isAutoUpload: selectIsAutoUpload(state),
});

// export connected component
export default connect(mapStateToProps)(ScheduledRun);
