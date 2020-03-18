import Immutable from 'seamless-immutable';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_PROCESS_RESTART,
} from './AccountListConstants';
import { AUTO_UPLOAD_TOGGLE } from '../AutoUploadSwitcher/AutoUploadSwitcherConstants';

const initialState = Immutable({
  accounts: {},
  pollingProcessID: 0,
  error: null,
});

export default (state = initialState, action) => {
  const {
    payload: {
      pollingProcessID,
      error,
      accounts,
      accountID,
      processStatusName,
      isAutoUpload,
    } = {},
  } = action;

  switch (action.type) {
    case INVENTORY_ACCOUNT_STATUS_POLLING:
      return state.merge({
        ...state,
        accounts,
        isAutoUpload,
        error: null,
      });
    case INVENTORY_ACCOUNT_STATUS_POLLING_ERROR:
      return state.merge({
        ...state,
        accounts: {},
        error,
      });
    case INVENTORY_ACCOUNT_STATUS_POLLING_START:
      return state.merge({
        ...state,
        pollingProcessID,
      });
    case INVENTORY_PROCESS_RESTART:
      return state.setIn(['accounts'], {
        ...state.accounts,
        [accountID]: {
          ...state.accounts[accountID],
          [processStatusName]: 'Restarting...',
        },
      });
    case AUTO_UPLOAD_TOGGLE:
      return state.merge({
        ...state,
        isAutoUpload,
      });
    default:
      return state;
  }
};
