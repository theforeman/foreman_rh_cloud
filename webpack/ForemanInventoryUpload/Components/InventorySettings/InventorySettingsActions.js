import { get, post } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import {
  INVENTORY_SETTINGS,
  INVENTORY_SETTINGS_PATH,
  INVENTORY_SET_SETTINGS_PATH,
  RH_INVENTORY_TOGGLE,
} from './InventorySettingsConstants';

export const getSettings = () =>
  get({
    key: INVENTORY_SETTINGS,
    url: INVENTORY_SETTINGS_PATH,
  });

export const setSetting = (setting, request) => dispatch => {
  dispatch(
    post({
      key: INVENTORY_SETTINGS,
      url: INVENTORY_SET_SETTINGS_PATH,
      params: setting,
      handleError: error =>
        dispatch(
          addToast({
            sticky: true,
            type: 'error',
            message: error.message,
          })
        ),
      ...request,
    })
  );
};

export const handleToggleRHInventory = current => ({
  type: RH_INVENTORY_TOGGLE,
  payload: {
    rhInventory: !current,
  },
});
