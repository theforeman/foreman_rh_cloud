import { foremanUrl } from '../../../ForemanRhCloudHelpers';

export const INVENTORY_SETTINGS = 'INVENTORY_SETTINGS';
export const INVENTORY_GET_SETTINGS_PATH = foremanUrl(
  '/foreman_inventory_upload/settings'
);
export const INVENTORY_SET_SETTINGS_PATH = foremanUrl(
  '/foreman_inventory_upload/setting'
);
