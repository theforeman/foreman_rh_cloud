import API from 'foremanReact/API';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import {
  AUTO_UPLOAD_TOGGLE,
  AUTO_UPLOAD_TOGGLE_ERROR,
} from './AutoUploadSwitcherConstants';

export const handleToggle = currentAutoUploadEnabled => async dispatch => {
  const toggledAutoUploadEnabled = !currentAutoUploadEnabled;
  try {
    const {
      data: { autoUploadEnabled },
    } = await API.post(inventoryUrl('auto_upload'), {
      value: toggledAutoUploadEnabled,
    });
    dispatch({
      type: AUTO_UPLOAD_TOGGLE,
      payload: {
        autoUploadEnabled,
      },
    });
  } catch (error) {
    dispatch({
      type: AUTO_UPLOAD_TOGGLE_ERROR,
      payload: {
        error: error.message,
      },
    });
  }
};
