import { combineReducers } from 'redux';
import { reducers as settingsReducers } from './Components/InsightsSettings';
import { reducers as tableReducers } from './Components/InsightsTable';

export default {
  InsightsCloudSync: combineReducers({
    ...settingsReducers,
    ...tableReducers,
  }),
};
