import Immutable from 'seamless-immutable';
import {
  YUPANA_ACCOUNT_STATUS_POLLING,
  YUPANA_ACCOUNT_STATUS_POLLING_ERROR,
  YUPANA_ACCOUNT_STATUS_POLLING_START,
} from './AccountListConstants';

const initialState = Immutable({
  statuses: {},
  pollingProcessID: 0,
});

export default (state = initialState, action) => {
  const { payload: { pollingProcessID, ...payload } = {} } = action;

  switch (action.type) {
    case YUPANA_ACCOUNT_STATUS_POLLING:
      return state.setIn(['statuses'], payload);
    case YUPANA_ACCOUNT_STATUS_POLLING_ERROR:
      return state.setIn(['statuses'], {});
    case YUPANA_ACCOUNT_STATUS_POLLING_START:
      return state.merge({
        ...state,
        pollingProcessID,
      });
    default:
      return state;
  }
};
