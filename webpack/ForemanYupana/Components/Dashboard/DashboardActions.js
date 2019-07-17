import {
  YUPANA_POLLING_START,
  YUPANA_POLLING_STOP,
  YUPANA_POLLING,
} from './DashboardConstants';
import { seperator } from './DashboardHelper';
import { selectPollingProcessID } from './DashboardSelectors';

export const startPolling = pollingProcessID => {
  window.__yupana__ = {
    logs: {
      generating: ['No running process', seperator],
      uploading: ['No running process', seperator],
    },
    completed: {
      generating: 0,
      uploading: 0,
    },
    files: [],
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

export const fetchLogs = () => {
  const { logs, completed, files } = window.__yupana__;
  return {
    // TODO: Add API call here
    type: YUPANA_POLLING,
    payload: {
      logs,
      completed,
      files,
    },
  };
};
