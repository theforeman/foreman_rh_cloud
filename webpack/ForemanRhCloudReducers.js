import { combineReducers } from 'redux';
import inventoryUploadReducers from './ForemanInventoryUpload/ForemanInventoryUploadReducers';
import insightsReducers from './InsightsCloudSync/InsightsCloudSyncReducers';

export default {
  ForemanRhCloud: combineReducers({
    ...inventoryUploadReducers,
    ...insightsReducers
  }),
};
