import API from 'foremanReact/API';
import { selectActiveTab } from './DashboardSelectors';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import {
  INVENTORY_POLLING_START,
  INVENTORY_POLLING_STOP,
  INVENTORY_POLLING,
  INVENTORY_TAB_CHANGED,
  INVENTORY_POLLING_ERROR,
  INVENTORY_REPORTS_DOWNLOAD,
  INVENTORY_TOGGLE_TERMINAL_FULL_SCREEN,
} from './DashboardConstants';

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
      data: { output, scheduled },
    } = await API.get(inventoryUrl(`${accountID}/${processController}/last`));
    const outputArray = output.split('\n');
    dispatch({
      type: INVENTORY_POLLING,
      payload: {
        accountID,
        activeTab,
        logs: outputArray,
        scheduled,
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

export const downloadReports = accountID => {
  window.location.href = inventoryUrl(`${accountID}/uploads/file`);
  return {
    type: INVENTORY_REPORTS_DOWNLOAD,
    payload: {
      accountID,
    },
  };
};

export const toggleFullScreen = accountID => (dispatch, getState) => {
  const activeTab = selectActiveTab(getState(), accountID);
  dispatch({
    type: INVENTORY_TOGGLE_TERMINAL_FULL_SCREEN,
    payload: {
      activeTab,
      accountID,
    },
  });
};
