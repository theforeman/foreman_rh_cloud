import API from 'foremanReact/API';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
  INVENTORY_PROCESS_RESTART,
} from './AccountListConstants';

export const fetchAccountsStatus = () => async dispatch => {
  try {
    const {
      data: { accounts, autoUploadEnabled },
    } = await API.get('accounts');
    dispatch({
      type: INVENTORY_ACCOUNT_STATUS_POLLING,
      payload: {
        accounts,
        autoUploadEnabled,
      },
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
      payload: {
        error: error.message,
      },
    });
  }
};

export const startAccountStatusPolling = pollingProcessID => ({
  type: INVENTORY_ACCOUNT_STATUS_POLLING_START,
  payload: {
    pollingProcessID,
  },
});

export const stopAccountStatusPolling = pollingProcessID => dispatch => {
  clearInterval(pollingProcessID);
  dispatch({
    type: INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
  });
};

export const restartProcess = (accountID, activeTab) => dispatch => {
  let processController = null;
  let processStatusName = null;

  if (activeTab === 'uploading') {
    processController = 'uploads';
    processStatusName = 'upload_report_status';
  } else {
    processController = 'reports';
    processStatusName = 'generate_report_status';
  }

  API.post(`${accountID}/${processController}`);
  dispatch({
    type: INVENTORY_PROCESS_RESTART,
    payload: {
      accountID,
      processStatusName,
    },
  });
};
