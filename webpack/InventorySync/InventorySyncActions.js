import API from 'foremanReact/API';
import { inventorySyncUrl } from './InventorySyncHelpers';
import {
  INVENTORY_SYNC_SUCCESS,
  INVENTORY_SYNC_FAILURE,
} from './InventorySyncConstants';

export const syncInventory = () => async dispatch => {
  try {
    await API.post(inventorySyncUrl('tasks'));
    dispatch({
      type: INVENTORY_SYNC_SUCCESS,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: INVENTORY_SYNC_FAILURE,
      payload: {
        error: error.message,
      },
    });
  }
};
