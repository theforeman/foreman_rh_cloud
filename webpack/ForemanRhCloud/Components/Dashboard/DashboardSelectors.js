import { selectForemanRhCloud } from '../../ForemanRhCloudSelectors';

export const selectDashboard = (state, accountID) =>
  selectForemanRhCloud(state).dashboard[accountID] || {};
export const selectUploading = (state, accountID) =>
  selectDashboard(state, accountID).uploading;
export const selectGenerating = (state, accountID) =>
  selectDashboard(state, accountID).generating;
export const selectPollingProcessID = (state, accountID) =>
  selectDashboard(state, accountID).pollingProcessID;
export const selectActiveTab = (state, accountID) =>
  selectDashboard(state, accountID).activeTab || 'generating';
export const selectShowFullScreen = (state, accountID) => {
  const activeTab = selectActiveTab(state, accountID);
  const tabProperties = selectDashboard(state, accountID)[activeTab];
  return tabProperties ? tabProperties.showFullScreen || false : false;
};
