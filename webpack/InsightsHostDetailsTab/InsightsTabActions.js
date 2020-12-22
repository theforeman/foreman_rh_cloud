import { API } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { insightsCloudUrl } from '../InsightsCloudSync/InsightsCloudSyncHelpers';
import {
  INSIGHTS_HITS_REQUEST,
  INSIGHTS_HITS_SUCCESS,
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
