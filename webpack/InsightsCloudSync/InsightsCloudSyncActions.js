import API from 'foremanReact/API';
import { insightsCloudUrl } from './InsightsCloudSyncHelpers';
import {
  INSIGHTS_CLOUD_SYNC_SUCCESS,
  INSIGHTS_CLOUD_SYNC_FAILURE,
} from './InsightsCloudSyncConstants';

export const syncInsights = () => async dispatch => {
  try {
    await API.post(insightsCloudUrl('tasks'));
    dispatch({
      type: INSIGHTS_CLOUD_SYNC_SUCCESS,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: INSIGHTS_CLOUD_SYNC_FAILURE,
      payload: {
        error: error.message,
      },
    });
  }
};
