import Immutable from 'seamless-immutable';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_PROCESS_RESTART,
} from './AccountListConstants';

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
      cloudToken,
      CloudConnectorStatus,
    } = {},
  } = action;

  switch (action.type) {
    case INVENTORY_ACCOUNT_STATUS_POLLING:
      return state.merge({
        ...state,
        accounts,
        cloudToken,
        CloudConnectorStatus,
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
    default:
      return state;
  }
};
