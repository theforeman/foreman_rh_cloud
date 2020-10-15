import API from 'foremanReact/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import { AUTO_UPLOAD_TOGGLE } from './AutoUploadSwitcherConstants';

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
  } catch ({ message }) {
    dispatch(
      addToast({
        sticky: true,
        type: 'error',
        message,
      })
    );
  }
};
