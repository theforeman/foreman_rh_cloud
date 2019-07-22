import {
  YUPANA_POLLING_START,
  YUPANA_POLLING_STOP,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
} from './DashboardConstants';
import { seperator } from './DashboardHelper';
import { selectPollingProcessID, selectActiveTab } from './DashboardSelectors';

export const startPolling = pollingProcessID => {
  window.__yupana__ = {
    generating: {
      logs: ['No running process', seperator],
      completed: 0,
    },
    uploading: {
      logs: ['No running process', seperator],
      completed: 0,
      files: [],
    },
  };
  return {
    type: YUPANA_POLLING_START,
    payload: {
      pollingProcessID,
    },
  };
};

export const stopPolling = () => (dispatch, getState) => {
  const pollingProcessID = selectPollingProcessID(getState());
  clearInterval(pollingProcessID);
  dispatch({
    type: YUPANA_POLLING_STOP,
  });
};

export const fetchLogs = () => (dispatch, getState) => {
  const activeTab = selectActiveTab(getState());
  const activeLogs = window.__yupana__[activeTab];
  dispatch({
    // TODO: Add API call here
    type: YUPANA_POLLING,
    payload: {
      ...activeLogs,
    },
  });
};

export const setActiveTab = tabName => ({
  type: YUPANA_TAB_CHANGED,
  payload: {
    activeTab: tabName,
  },
});
