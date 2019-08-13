import API from 'foremanReact/API';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
} from './AccountListConstants';

export const fetchAccountsStatus = () => async dispatch => {
  try {
    const {
      data: { statuses },
    } = await API.get('statuses');
    dispatch({
      type: INVENTORY_ACCOUNT_STATUS_POLLING,
      payload: {
        statuses,
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
