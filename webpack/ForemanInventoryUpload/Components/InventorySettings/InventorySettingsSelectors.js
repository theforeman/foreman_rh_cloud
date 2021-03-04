import { selectAPIResponse } from 'foremanReact/redux/API/APISelectors';
import { INVENTORY_SETTINGS } from './InventorySettingsConstants';

export const selectSettings = state =>
  selectAPIResponse(state, INVENTORY_SETTINGS);

export const selectAutoUploadEnabled = state =>
  selectSettings(state).autoUploadEnabled;

export const selectHostObfuscationEnabled = state =>
  selectSettings(state).hostObfuscationEnabled;

export const selectIpsObfuscationEnabled = state =>
  selectSettings(state).ipsObfuscationEnabled;

export const selectExcludePackages = state =>
  selectSettings(state).excludePackagesEnabled;

export const selectCloudToken = state => selectSettings(state).cloudToken;
