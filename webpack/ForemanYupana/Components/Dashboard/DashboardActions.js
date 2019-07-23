import API from 'foremanReact/API';
import {
  YUPANA_POLLING_START,
  YUPANA_POLLING_STOP,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
  YUPANA_POLLING_ERROR,
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

export const fetchLogs = () => async (dispatch, getState) => {
  const activeTab = selectActiveTab(getState());
  try {
    const requestController = activeTab === 'uploading' ? 'uploads' : 'reports';
    const {
      data: { output, status },
    } = await API.get(`${requestController}/last`);
    dispatch({
      type: YUPANA_POLLING,
      payload: {
        logs: output,
        exitCode: status,
      },
    });
  } catch (error) {
    dispatch({
      type: YUPANA_POLLING_ERROR,
      payload: {
        error: error.message,
      },
    });
  }
};

export const setActiveTab = tabName => ({
  type: YUPANA_TAB_CHANGED,
  payload: {
    activeTab: tabName,
  },
});
