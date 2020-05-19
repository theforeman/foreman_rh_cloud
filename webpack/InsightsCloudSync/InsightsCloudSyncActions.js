import API from 'foremanReact/API';
import { insightsCloudUrl } from './InsightsCloudSyncHelpers';
import { INSIGHTS_CLOUD_SYNC_TASK } from './InsightsCloudSyncConstants';

export const syncInsights = () => async dispatch => {
  try {
    await API.post(insightsCloudUrl('tasks'));
    dispatch({
      type: INSIGHTS_CLOUD_SYNC_TASK,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: INSIGHTS_CLOUD_SYNC_TASK,
      payload: {
        error: error.message,
      },
    });
  }
};
