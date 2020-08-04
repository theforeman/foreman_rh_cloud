export const rhCloudStateWrapper = (
  inventoryState = {},
  insightsState = {}
) => ({
  ForemanRhCloud: {
    inventoryUpload: { ...inventoryState },
    InsightsCloudSync: { ...insightsState },
  },
});

export const inventoryStateWrapper = innerState =>
  rhCloudStateWrapper(innerState);

export const insightsStateWrapper = innerState =>
  rhCloudStateWrapper({}, innerState);
