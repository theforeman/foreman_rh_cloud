import { selectForemanInventoryUpload } from '../../ForemanInventoryUploadSelectors';

export const selectAccountsList = state =>
  selectForemanInventoryUpload(state).accountsList;
export const selectStatuses = state => selectAccountsList(state).statuses;
export const selectPollingProcessID = state =>
  selectAccountsList(state).pollingProcessID;
export const selectError = state => selectAccountsList(state).error;
