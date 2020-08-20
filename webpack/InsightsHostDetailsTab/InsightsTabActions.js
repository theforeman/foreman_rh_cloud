import API from 'foremanReact/API';
import { insightsCloudUrl } from '../InsightsCloudSync/InsightsCloudSyncHelpers';
import {
  INSIGHTS_HITS_REQUEST,
  INSIGHTS_HITS_SUCCESS,
  INSIGHTS_HITS_FAILURE,
} from './InsightsTabConstants';

export const fetchHits = hostID => async dispatch => {
  try {
    dispatch({
      type: INSIGHTS_HITS_REQUEST,
      payload: {},
    });
    const {
      data: { hits },
    } = await API.get(insightsCloudUrl(`hits/${hostID}`));
    dispatch({
      type: INSIGHTS_HITS_SUCCESS,
      payload: { hits },
    });
  } catch (error) {
    dispatch({
      type: INSIGHTS_HITS_FAILURE,
      payload: {
        error: error.message,
      },
    });
  }
};
