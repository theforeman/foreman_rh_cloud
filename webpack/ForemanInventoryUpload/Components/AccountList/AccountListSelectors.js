import { selectForemanInventoryUpload } from '../../../ForemanRhCloudSelectors';

export const selectAccountsList = state =>
  selectForemanInventoryUpload(state).accountsList;

export const selectAccounts = state => selectAccountsList(state).accounts;

export const selectPollingProcessID = state =>
  selectAccountsList(state).pollingProcessID;

export const selectError = state => selectAccountsList(state).error;
