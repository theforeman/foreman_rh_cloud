import Immutable from 'seamless-immutable';
import {
  INSIGHTS_SET_SELECTED_IDS,
  INSIGHTS_HIDE_SELECT_ALL_ALERT,
} from './InsightsTableConstants';

const initialState = Immutable({
  selectedIds: {},
  showSelectAllAlert: false,
});

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case INSIGHTS_SET_SELECTED_IDS:
      return state.merge(payload);
    case INSIGHTS_HIDE_SELECT_ALL_ALERT:
      return state.merge({ showSelectAllAlert: false });
    default:
      return state;
  }
};
