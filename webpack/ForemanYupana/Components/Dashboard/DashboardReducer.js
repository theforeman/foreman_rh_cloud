import Immutable from 'seamless-immutable';

import {
  YUPANA_POLLING_START,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
  YUPANA_POLLING_ERROR,
} from './DashboardConstants';
import { seperator } from './DashboardHelper';

const initialState = Immutable({
  /** insert Dashboard state here */
  generating: {
    logs: ['No running process', seperator],
    completed: 0,
    error: null,
  },
  uploading: {
    logs: ['No running process', seperator],
    completed: 0,
    files: [],
    error: null,
  },
  pollingProcessID: 0,
  activeTab: 'uploading',
});

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case YUPANA_POLLING_START:
      return state.merge({
        pollingProcessID: payload.pollingProcessID,
      });
    case YUPANA_POLLING:
      return state.setIn([state.activeTab], payload);
    case YUPANA_TAB_CHANGED:
      return state.merge({
        activeTab: payload.activeTab,
      });
    case YUPANA_POLLING_ERROR:
      return state.setIn([state.activeTab], {
        ...state[state.activeTab],
        error: payload.error,
      });
    default:
      return state;
  }
};
