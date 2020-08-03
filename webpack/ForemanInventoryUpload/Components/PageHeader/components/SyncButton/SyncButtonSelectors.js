import { selectForemanInventoryUpload } from '../../../../../ForemanRhCloudSelectors';

export const selectInventorySync = state =>
  selectForemanInventoryUpload(state).inventorySync;

export const selectStatus = state => selectInventorySync(state).status;

export const selectError = state => selectInventorySync(state).error;

export const selectSyncHosts = state => selectInventorySync(state).syncHosts;

export const selectDisconnectHosts = state =>
  selectInventorySync(state).disconnectHosts;
