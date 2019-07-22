import { selectForemanYupana } from '../../ForemanYupanaSelectors';

export const selectDashboard = state => selectForemanYupana(state).dashboard;
export const selectUploading = state => selectDashboard(state).uploading;
export const selectGenerating = state => selectDashboard(state).generating;
export const selectPollingProcessID = state =>
  selectDashboard(state).pollingProcessID;
export const selectActiveTab = state => selectDashboard(state).activeTab;
