import { get, post } from 'foremanReact/redux/API';
import {
  INVENTORY_SETTINGS,
  INVENTORY_GET_SETTINGS_PATH,
  INVENTORY_SET_SETTINGS_PATH,
} from './InventorySettingsConstants';

export const getSettings = () =>
  get({
    key: INVENTORY_SETTINGS,
    url: INVENTORY_GET_SETTINGS_PATH,
  });

export const setSetting = setting => dispatch => {
  dispatch(
    post({
      key: INVENTORY_SETTINGS,
      url: INVENTORY_SET_SETTINGS_PATH,
      params: setting,
      errorToast: error => error.message,
    })
  );
};
