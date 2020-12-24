import { API } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import { HOST_OBFUSCATION_TOGGLE } from './HostObfuscationSwitcherConstants';

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
