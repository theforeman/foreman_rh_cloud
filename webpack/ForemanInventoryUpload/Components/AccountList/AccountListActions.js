import { API } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
  INVENTORY_PROCESS_RESTART,
} from './AccountListConstants';

export const fetchAccountsStatus = () => async dispatch => {
  try {
    const { data } = await API.get(inventoryUrl('accounts'));
    dispatch({
      type: INVENTORY_ACCOUNT_STATUS_POLLING,
      payload: data,
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

export const restartDisconnected = (accountID, activeTab) => async dispatch => {
  let processController = null;
  let processStatusName = null;
  let disconnected = true

  if (activeTab === 'uploading') {
    processController = 'uploads';
    processStatusName = 'upload_report_status';
  } else {
    processController = 'reports';
    processStatusName = 'generate_report_status';
  }

  try {
    await API.post(inventoryUrl(`${accountID}/${processController}`));
    dispatch({
      type: INVENTORY_PROCESS_RESTART,
      payload: {
        accountID,
        disconnected,
        processStatusName,
      },
    });
  } catch (error) {
    dispatch(
      addToast({
        sticky: true,
        type: 'error',
        message: error.message,
      })
    );
  }
};

export const restartProcess = (accountID, activeTab) => async dispatch => {
  let processController = null;
  let processStatusName = null;

  if (activeTab === 'uploading') {
    processController = 'uploads';
    processStatusName = 'upload_report_status';
  } else {
    processController = 'reports';
    processStatusName = 'generate_report_status';
  }

  try {
    await API.post(inventoryUrl(`${accountID}/${processController}`));
    dispatch({
      type: INVENTORY_PROCESS_RESTART,
      payload: {
        accountID,
        processStatusName,
      },
    });
  } catch (error) {
    dispatch(
      addToast({
        sticky: true,
        type: 'error',
        message: error.message,
      })
    );
  }
};
