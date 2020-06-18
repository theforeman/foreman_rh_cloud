export const selectForemanRhCloud = state => state.ForemanRhCloud;
export const selectForemanInventoryUpload = state =>
  selectForemanRhCloud(state).inventoryUpload;
export const selectInsightsCloudSync = state =>
  selectForemanRhCloud(state).InsightsCloudSync;
