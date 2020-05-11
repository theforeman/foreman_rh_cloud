export const inventoryStateWrapper = innerState => ({
  ForemanRhCloud: {
    inventoryUpload: { ...innerState },
  },
});
