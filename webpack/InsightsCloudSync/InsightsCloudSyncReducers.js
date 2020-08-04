import { combineReducers } from 'redux';
import { reducers as settingsReducers } from './Components/InsightsSettings';

export default {
  InsightsCloudSync: combineReducers({
    ...settingsReducers,
  }),
};
