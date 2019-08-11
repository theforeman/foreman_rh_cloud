// export const selectInventoryUpload = state => state.InventoryUpload || {};
// Added 'state' to use redux in storybook only, should be removed.
export const selectInventoryUpload = state => state.InventoryUpload || state || {};
