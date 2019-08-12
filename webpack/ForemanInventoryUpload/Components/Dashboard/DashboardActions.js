import API from 'foremanReact/API';
import {
  INVENTORY_POLLING_START,
  INVENTORY_POLLING_STOP,
  INVENTORY_POLLING,
  INVENTORY_TAB_CHANGED,
  INVENTORY_POLLING_ERROR,
  INVENTORY_PROCESS_RESTART,
  INVENTORY_REPORTS_DOWNLOAD,
} from './DashboardConstants';
import { selectActiveTab } from './DashboardSelectors';

export const startPolling = (accountID, pollingProcessID) => ({
  type: INVENTORY_POLLING_START,
  payload: {
    accountID,
    pollingProcessID,
  },
});

export const stopPolling = (accountID, pollingProcessID) => dispatch => {
  clearInterval(pollingProcessID);
  dispatch({
    type: INVENTORY_POLLING_STOP,
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
      data: { output },
    } = await API.get(`${accountID}/${processController}/last`);
    const outputArray = output.split('\n');
    dispatch({
      type: INVENTORY_POLLING,
      payload: {
        accountID,
        activeTab,
        logs: outputArray,
      },
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_POLLING_ERROR,
      payload: {
        accountID,
        activeTab,
        error: error.message,
      },
    });
  }
};

export const setActiveTab = (accountID, tabName) => ({
  type: INVENTORY_TAB_CHANGED,
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
    type: INVENTORY_PROCESS_RESTART,
    payload: {
      accountID,
    },
  });
};

export const downloadReports = accountID => {
  window.location.href = `/foreman_inventory_upload/${accountID}/uploads/file`;
  return {
    type: INVENTORY_REPORTS_DOWNLOAD,
    payload: {
      accountID,
    },
  };
};
