import { selectForemanInventoryUpload } from '../../ForemanInventoryUploadSelectors';

export const selectDashboard = (state, accountID) =>
  selectForemanInventoryUpload(state).dashboard[accountID] || {};
export const selectUploading = (state, accountID) =>
  selectDashboard(state, accountID).uploading;
export const selectGenerating = (state, accountID) =>
  selectDashboard(state, accountID).generating;
export const selectPollingProcessID = (state, accountID) =>
  selectDashboard(state, accountID).pollingProcessID;
export const selectActiveTab = (state, accountID) =>
  selectDashboard(state, accountID).activeTab;
