import { combineReducers } from 'redux';
import inventoryUploadReducers from './ForemanInventoryUpload/ForemanInventoryUploadReducers';
import insightsReducers from './InsightsCloudSync/InsightsCloudSyncReducers';
import { hostInsightsReducers } from './InsightsHostDetailsTab';

export default {
  ForemanRhCloud: combineReducers({
    ...inventoryUploadReducers,
    ...insightsReducers,
    ...hostInsightsReducers,
  }),
};
