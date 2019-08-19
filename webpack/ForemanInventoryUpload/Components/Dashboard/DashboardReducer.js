import Immutable from 'seamless-immutable';

import {
  INVENTORY_POLLING_START,
  INVENTORY_POLLING,
  INVENTORY_TAB_CHANGED,
  INVENTORY_POLLING_ERROR,
  INVENTORY_TOGGLE_TERMINAL_FULL_SCREEN,
} from './DashboardConstants';

const initialState = Immutable({});

export default (state = initialState, action) => {
  const {
    payload: { accountID, pollingProcessID, logs, error, activeTab } = {},
  } = action;

  const getTabState = () =>
    state[accountID] ? state[accountID][activeTab] : {};
  switch (action.type) {
    case INVENTORY_POLLING_START:
      return state.setIn([accountID], {
        ...state[accountID],
        pollingProcessID,
        activeTab: 'generating',
      });
    case INVENTORY_POLLING:
      return state.setIn([accountID], {
        ...state[accountID],
        [activeTab]: {
          ...getTabState(),
          logs,
          error: null,
        },
      });
    case INVENTORY_TAB_CHANGED:
      return state.setIn([accountID], {
        ...state[accountID],
        activeTab,
      });
    case INVENTORY_POLLING_ERROR:
      return state.setIn([accountID], {
        ...state[accountID],
        [activeTab]: {
          ...getTabState(),
          error,
        },
      });
    case INVENTORY_TOGGLE_TERMINAL_FULL_SCREEN:
      return state.setIn([accountID], {
        ...state[accountID],
        [activeTab]: {
          ...getTabState(),
          showFullScreen: !state[accountID][activeTab].showFullScreen,
        },
      });
    default:
      return state;
  }
};
