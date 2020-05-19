import API from 'foremanReact/API';
import { insightsCloudUrl } from './InsightsCloudSyncHelpers';
import { INSIGHTS_CLOUD_SYNC_TASK } from './InsightsCloudSyncConstants';

export const syncInsights = () => {
  API.post(insightsCloudUrl('tasks'));
  return {
    type: INSIGHTS_CLOUD_SYNC_TASK,
    payload: {},
  };
};
