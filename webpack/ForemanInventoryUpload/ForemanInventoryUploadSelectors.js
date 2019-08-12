// export const selectForemanInventoryUpload = state => state.ForemanInventoryUpload || {};
// Added 'state' to use redux in storybook only, should be removed.
export const selectForemanInventoryUpload = state => state.ForemanInventoryUpload || state || {};
