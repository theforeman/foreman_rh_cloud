export const rhCloudStateWrapper = innerState => ({
  ForemanRhCloud: {
    inventoryUpload: { ...innerState },
    InsightsCloudSync: { ...innerState },
  },
});
