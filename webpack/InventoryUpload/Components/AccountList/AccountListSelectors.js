import { selectInventoryUpload } from '../../InventoryUploadSelectors';

export const selectAccountsList = state =>
  selectInventoryUpload(state).accountsList;
export const selectStatuses = state => selectAccountsList(state).statuses;
export const selectPollingProcessID = state =>
  selectAccountsList(state).pollingProcessID;
