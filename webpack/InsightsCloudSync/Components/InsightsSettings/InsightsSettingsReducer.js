import Immutable from 'seamless-immutable';
import {
  INSIGHTS_SYNC_SETTING_SET,
  INSIGHTS_SYNC_SETTING_SET_FAILURE,
  INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
  INSIGHTS_SYNC_SETTINGS_GET_FAILURE,
} from './InsightsSettingsConstants';

const initialState = Immutable({
  insightsSyncEnabled: false,
});

export default (state = initialState, action) => {
  const { payload: { settings } = {} } = action;

  switch (action.type) {
    case INSIGHTS_SYNC_SETTINGS_GET_SUCCESS:
    case INSIGHTS_SYNC_SETTINGS_GET_FAILURE:
    case INSIGHTS_SYNC_SETTING_SET:
    case INSIGHTS_SYNC_SETTING_SET_FAILURE:
      return state.merge({
        ...state,
        ...settings,
      });
    default:
      return state;
  }
};
