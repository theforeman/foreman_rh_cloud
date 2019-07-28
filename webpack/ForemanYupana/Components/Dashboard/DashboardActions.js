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
import { selectPollingProcessID, selectActiveTab } from './DashboardSelectors';

export const startPolling = pollingProcessID => ({
  type: YUPANA_POLLING_START,
  payload: {
    pollingProcessID,
  },
});

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
    const {
      data: { output, status },
    } = await API.get(`${activeTab}/last`);
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

export const restartProcess = () =>
  // const activeTab = selectActiveTab(getState());
  // TODO: add API call here.
  ({
    type: YUPANA_PROCESS_RESTART,
  });

export const downloadReports = () => dispatch => {
  // TODO: Add API call here
  setTimeout(() => {
    const response = {
      file:
        'https://download.fedoraproject.org/pub/fedora/linux/releases/30/Workstation/x86_64/iso/Fedora-Workstation-netinst-x86_64-30-1.2.iso',
    };
    // server sent the url to the file!
    // now, let's download:
    window.location.href = response.file;
  }, 100);
  dispatch({
    type: YUPANA_REPORTS_DOWNLOAD,
  });
};
