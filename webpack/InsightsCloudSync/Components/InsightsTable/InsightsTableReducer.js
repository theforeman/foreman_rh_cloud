import Immutable from 'seamless-immutable';
import {
  INSIGHTS_SET_SELECTED_IDS,
  INSIGHTS_SET_SELECT_ALL_ALERT,
  INSIGHTS_SET_SELECT_ALL,
} from './InsightsTableConstants';

const initialState = Immutable({
  selectedIds: {},
  showSelectAllAlert: false,
  isAllSelected: false,
});

export default (
  state = initialState,
  { payload: { selectedIds, showSelectAllAlert, isAllSelected } = {}, type }
) => {
  switch (type) {
    case INSIGHTS_SET_SELECTED_IDS:
      return state.merge({ selectedIds });
    case INSIGHTS_SET_SELECT_ALL_ALERT:
      return state.merge({ showSelectAllAlert });
    case INSIGHTS_SET_SELECT_ALL:
      return state.merge({ isAllSelected });
    default:
      return state;
  }
};
