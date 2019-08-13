import Immutable from 'seamless-immutable';
import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
} from './AccountListConstants';

const initialState = Immutable({
  statuses: {},
  pollingProcessID: 0,
  error: null,
});

export default (state = initialState, action) => {
  const { payload: { pollingProcessID, error, statuses } = {} } = action;

  switch (action.type) {
    case INVENTORY_ACCOUNT_STATUS_POLLING:
      return state.merge({
        ...state,
        statuses,
        error: null,
      });
    case INVENTORY_ACCOUNT_STATUS_POLLING_ERROR:
      return state.merge({
        ...state,
        statuses: {},
        error,
      });
    case INVENTORY_ACCOUNT_STATUS_POLLING_START:
      return state.merge({
        ...state,
        pollingProcessID,
      });
    default:
      return state;
  }
};
