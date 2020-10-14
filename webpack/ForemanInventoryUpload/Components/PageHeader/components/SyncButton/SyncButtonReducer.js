import Immutable from 'seamless-immutable';
import { STATUS } from 'foremanReact/constants';
import {
  INVENTORY_SYNC_REQUEST,
  INVENTORY_SYNC_SUCCESS,
} from './SyncButtonConstants';

export default (
  state = Immutable({}),
  { type, payload: { syncHosts, disconnectHosts, error } = {} }
) => {
  switch (type) {
    case INVENTORY_SYNC_REQUEST:
      return state.merge({
        ...state,
        status: STATUS.PENDING,
        error: null,
      });
    case INVENTORY_SYNC_SUCCESS:
      return state.merge({
        ...state,
        status: STATUS.RESOLVED,
        syncHosts,
        disconnectHosts,
      });
    default:
      return state;
  }
};
