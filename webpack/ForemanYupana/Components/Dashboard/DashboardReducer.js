import Immutable from 'seamless-immutable';

import {
  YUPANA_POLLING_START,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
  YUPANA_POLLING_ERROR,
} from './DashboardConstants';

const initialState = Immutable({});

export default (state = initialState, action) => {
  const {
    payload: { accountID, pollingProcessID, logs, error, activeTab } = {},
  } = action;
  switch (action.type) {
    case YUPANA_POLLING_START:
      return state.setIn([accountID], {
        ...state[accountID],
        pollingProcessID,
        activeTab: 'generating',
      });
    case YUPANA_POLLING:
      return state.setIn([accountID], {
        ...state[accountID],
        [activeTab]: {
          logs,
          error: null,
        },
      });
    case YUPANA_TAB_CHANGED:
      return state.setIn([accountID], {
        ...state[accountID],
        activeTab,
      });
    case YUPANA_POLLING_ERROR:
      return state.setIn([accountID], {
        ...state[accountID],
        [activeTab]: {
          ...state[activeTab],
          error,
        },
      });
    default:
      return state;
  }
};
