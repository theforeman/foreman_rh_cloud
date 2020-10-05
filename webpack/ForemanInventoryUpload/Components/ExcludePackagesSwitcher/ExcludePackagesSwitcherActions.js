import API from 'foremanReact/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { inventoryUrl } from '../../ForemanInventoryHelpers';
import { EXCLUDE_PACKAGES_TOGGLE } from './ExcludePackagesSwitcherConstants';

export const handleToggle = currentExcludePackages => async dispatch => {
  const toggledExcludePackages = !currentExcludePackages;
  try {
    const {
      data: { excludePackages },
    } = await API.post(inventoryUrl('installed_packages_inclusion'), {
      value: toggledExcludePackages,
    });
    dispatch({
      type: EXCLUDE_PACKAGES_TOGGLE,
      payload: {
        excludePackages,
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
