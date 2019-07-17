import {
  YUPANA_POLLING_START,
  YUPANA_POLLING_STOP,
  YUPANA_POLLING,
} from './DashboardConstants';
import { seperator } from './DashboardHelper';

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
  };
  return {
    type: YUPANA_POLLING_START,
    payload: {
      pollingProcessID,
    },
  };
};

export const stopPolling = pollingProcessID => {
  clearInterval(pollingProcessID);
  return {
    type: YUPANA_POLLING_STOP,
  };
};

export const fetchLogs = () => ({
  // TODO: Add API call here
  type: YUPANA_POLLING,
  payload: {
    logs: window.__yupana__.logs,
    completed: window.__yupana__.completed,
  },
});
