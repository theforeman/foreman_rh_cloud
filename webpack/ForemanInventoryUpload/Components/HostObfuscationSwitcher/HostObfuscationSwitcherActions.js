import API from 'foremanReact/API';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import {
  HOST_OBFUSCATION_TOGGLE,
  HOST_OBFUSCATION_TOGGLE_ERROR,
} from './HostObfuscationSwitcherConstants';

export const handleToggle = currentHostObfuscationEnabled => async dispatch => {
  const toggledHostObfuscationEnabled = !currentHostObfuscationEnabled;
  try {
    const {
      data: { hostObfuscationEnabled },
    } = await API.post(inventoryUrl('host_obfuscation'), {
      value: toggledHostObfuscationEnabled,
    });
    dispatch({
      type: HOST_OBFUSCATION_TOGGLE,
      payload: {
        hostObfuscationEnabled,
      },
    });
  } catch (error) {
    dispatch({
      type: HOST_OBFUSCATION_TOGGLE_ERROR,
      payload: {
        error: error.message,
      },
    });
  }
};
