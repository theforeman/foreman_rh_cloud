import API from 'foremanReact/API';
import { insightsCloudUrl } from '../../InsightsCloudSyncHelpers';
import {
  INSIGHTS_SYNC_SETTING_SET,
  INSIGHTS_SYNC_SETTING_SET_FAILURE,
  INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
  INSIGHTS_SYNC_SETTINGS_GET_FAILURE,
} from './InsightsSettingsConstants';

export const getInsightsSyncSettings = () => async dispatch => {
  try {
    const {
      data: { insightsSyncEnabled },
    } = await API.get(insightsCloudUrl('settings'));
    dispatch({
      type: INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
      payload: {
        settings: {
          insightsSyncEnabled,
        },
      },
    });
  } catch (error) {
    dispatch({
      type: INSIGHTS_SYNC_SETTINGS_GET_FAILURE,
      payload: {
        settings: {
          error: error.message,
        },
      },
    });
  }
};

export const setInsightsSyncEnabled = currentInsightsSyncEnabled => async dispatch => {
  try {
    const {
      data: { insightsSyncEnabled },
    } = await API.patch(insightsCloudUrl('settings'), {
      insightsSyncEnabled: currentInsightsSyncEnabled,
    });
    dispatch({
      type: INSIGHTS_SYNC_SETTING_SET,
      payload: {
        settings: {
          insightsSyncEnabled,
        },
      },
    });
  } catch (error) {
    dispatch({
      type: INSIGHTS_SYNC_SETTING_SET_FAILURE,
      payload: {
        settings: {
          error: error.message,
        },
      },
    });
  }
};
