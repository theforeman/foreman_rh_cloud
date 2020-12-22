import { API } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import { IPS_OBFUSCATION_TOGGLE } from './IpsObfuscationSwitcherConstants';

export const handleToggle = currentIpsObfuscationEnabled => async dispatch => {
  const toggledIpsObfuscationEnabled = !currentIpsObfuscationEnabled;
  try {
    const {
      data: { ipsObfuscationEnabled },
    } = await API.post(inventoryUrl('ips_obfuscation'), {
      value: toggledIpsObfuscationEnabled,
    });
    dispatch({
      type: IPS_OBFUSCATION_TOGGLE,
      payload: {
        ipsObfuscationEnabled,
      },
    });
  } catch (error) {
    dispatch(
      addToast({
        sticky: true,
        type: 'error',
        message: error.message,
      })
    );
  }
};
