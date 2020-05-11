export const selectForemanRhCloud = state => state.ForemanRhCloud;
export const selectForemanInventoryUpload = state =>
  selectForemanRhCloud(state).inventoryUpload;
