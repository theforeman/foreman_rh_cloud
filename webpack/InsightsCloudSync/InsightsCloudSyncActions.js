import API from 'foremanReact/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { insightsCloudUrl } from './InsightsCloudSyncHelpers';
import { INSIGHTS_CLOUD_SYNC_SUCCESS } from './InsightsCloudSyncConstants';

export const syncInsights = () => async dispatch => {
  try {
    await API.post(insightsCloudUrl('tasks'));
    dispatch({
      type: INSIGHTS_CLOUD_SYNC_SUCCESS,
      payload: {},
    });
  } catch ({ message }) {
    dispatch(
      addToast({
        sticky: true,
        type: 'error',
        message,
      })
    );
  }
};
