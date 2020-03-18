import API from 'foremanReact/API';
import {
  AUTO_UPLOAD_TOGGLE,
  AUTO_UPLOAD_TOGGLE_ERROR,
} from './AutoUploadSwitcherConstants';

export const handleToggle = () => async dispatch => {
  try {
    const {
      data: { isAutoUpload },
    } = await API.post('toggle_auto_upload');
    dispatch({
      type: AUTO_UPLOAD_TOGGLE,
      payload: {
        isAutoUpload,
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
