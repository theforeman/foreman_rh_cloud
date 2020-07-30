import Immutable from 'seamless-immutable';
import { STATUS } from 'foremanReact/constants';
import {
  INVENTORY_SYNC_REQUEST,
  INVENTORY_SYNC_SUCCESS,
  INVENTORY_SYNC_FAILURE,
} from './SyncButtonConstants';

export default (
  state = Immutable({}),
  { type, payload: { syncHosts, disconnectHosts, error } = {} }
) => {
  switch (type) {
    case INVENTORY_SYNC_REQUEST:
      return state.merge({
        status: STATUS.PENDING,
        error: null,
      });
    case INVENTORY_SYNC_SUCCESS:
      return state.merge({
        status: STATUS.RESOLVED,
        syncHosts,
        disconnectHosts,
      });
    case INVENTORY_SYNC_FAILURE:
      return state.merge({
        status: STATUS.ERROR,
        error,
      });
    default:
      return state;
  }
};
