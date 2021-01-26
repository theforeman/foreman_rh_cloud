import { selectForemanInventoryUpload } from '../../../ForemanRhCloudSelectors';

export const selectSettings = state =>
  selectForemanInventoryUpload(state).inventorySettings || {};

export const selectCloudConnectorEnabled = state =>
  selectSettings(state).cloudConnector;

export const selectRHInventoryEnabled = state =>
  selectSettings(state).rhInventory;
