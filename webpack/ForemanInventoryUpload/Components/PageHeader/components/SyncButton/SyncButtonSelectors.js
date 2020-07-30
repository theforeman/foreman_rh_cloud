import { selectForemanInventoryUpload } from '../../../../../ForemanRhCloudSelectors';

export const selectInventorySync = state =>
  selectForemanInventoryUpload(state).inventorySync;

export const selectStatus = state => selectInventorySync(state).status;
