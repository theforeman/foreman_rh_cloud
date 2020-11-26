import { combineReducers } from 'redux';
import { registerReducer } from 'foremanReact/common/MountingService';
import inventoryUploadReducers from './ForemanInventoryUpload/ForemanInventoryUploadReducers';
import insightsReducers from './InsightsCloudSync/InsightsCloudSyncReducers';
import { hostInsightsReducers } from './InsightsHostDetailsTab';

const reducers = {
  ForemanRhCloud: combineReducers({
    ...inventoryUploadReducers,
    ...insightsReducers,
    ...hostInsightsReducers,
  }),
};

export default reducers;

export const registerReducers = () => {
  Object.entries(reducers).forEach(([key, reducer]) =>
    registerReducer(key, reducer)
  );
};
