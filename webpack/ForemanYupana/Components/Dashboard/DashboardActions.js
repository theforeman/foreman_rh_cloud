import API from 'foremanReact/API';
import {
  YUPANA_POLLING_START,
  YUPANA_POLLING_STOP,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
  YUPANA_POLLING_ERROR,
  YUPANA_PROCESS_RESTART,
  YUPANA_REPORTS_DOWNLOAD,
} from './DashboardConstants';
import { selectActiveTab } from './DashboardSelectors';

export const startPolling = (accountID, pollingProcessID) => ({
  type: YUPANA_POLLING_START,
  payload: {
    accountID,
    pollingProcessID,
  },
});

export const stopPolling = (accountID, pollingProcessID) => dispatch => {
  clearInterval(pollingProcessID);
  dispatch({
    type: YUPANA_POLLING_STOP,
    payload: {
      accountID,
    },
  });
};

export const fetchLogs = accountID => async (dispatch, getState) => {
  const activeTab = selectActiveTab(getState(), accountID);
  try {
    const processController = activeTab === 'uploading' ? 'uploads' : 'reports';
    const {
      data: { output, status },
    } = await API.get(`${accountID}/${processController}/last`);
    dispatch({
      type: YUPANA_POLLING,
      payload: {
        accountID,
        activeTab,
        logs: output,
        exitCode: status,
      },
    });
  } catch (error) {
    dispatch({
      type: YUPANA_POLLING_ERROR,
      payload: {
        accountID,
        activeTab,
        error: error.message,
      },
    });
  }
};

export const setActiveTab = (accountID, tabName) => ({
  type: YUPANA_TAB_CHANGED,
  payload: {
    accountID,
    activeTab: tabName,
  },
});

export const restartProcess = accountID => (dispatch, getState) => {
  const activeTab = selectActiveTab(getState(), accountID);
  const processController = activeTab === 'uploading' ? 'uploads' : 'reports';
  API.post(`${accountID}/${processController}`);
  dispatch({
    type: YUPANA_PROCESS_RESTART,
    payload: {
      accountID,
    },
  });
};

export const downloadReports = accountID => {
  window.location.href = `/foreman_yupana/${accountID}/uploads/file`;
  return {
    type: YUPANA_REPORTS_DOWNLOAD,
    payload: {
      accountID,
    },
  };
};
