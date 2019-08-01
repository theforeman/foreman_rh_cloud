// import API from 'foremanReact/API';
import {
  YUPANA_ACCOUNT_STATUS_POLLING,
  YUPANA_ACCOUNT_STATUS_POLLING_ERROR,
  YUPANA_ACCOUNT_STATUS_POLLING_START,
  YUPANA_ACCOUNT_STATUS_POLLING_STOP,
} from './AccountListConstants';
// just for some mock data
import { API_SUCCESS_RESPONSE } from './AccountList.fixtures';

export const fetchAccountsStatus = () => async dispatch => {
  try {
    // const {
    //   data: { statuses },
    // } = await API.get('statuses');
    dispatch({
      type: YUPANA_ACCOUNT_STATUS_POLLING,
      // payload: statuses,
      payload: API_SUCCESS_RESPONSE,
    });
  } catch (error) {
    dispatch({
      type: YUPANA_ACCOUNT_STATUS_POLLING_ERROR,
      payload: {
        error: error.message,
      },
    });
  }
};

export const startAccountStatusPolling = pollingProcessID => ({
  type: YUPANA_ACCOUNT_STATUS_POLLING_START,
  payload: {
    pollingProcessID,
  },
});

export const stopAccountStatusPolling = pollingProcessID => dispatch => {
  clearInterval(pollingProcessID);
  dispatch({
    type: YUPANA_ACCOUNT_STATUS_POLLING_STOP,
  });
};
