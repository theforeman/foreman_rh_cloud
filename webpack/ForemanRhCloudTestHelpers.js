export const rhCloudStateWrapper = (
  inventoryState = {},
  insightsState = {},
  hostInsightsState = {}
) => ({
  ForemanRhCloud: {
    inventoryUpload: { ...inventoryState },
    InsightsCloudSync: { ...insightsState },
    hostInsights: { ...hostInsightsState },
  },
});

export const inventoryStateWrapper = innerState =>
  rhCloudStateWrapper(innerState);

export const insightsStateWrapper = innerState =>
  rhCloudStateWrapper({}, innerState);

export const hostInsightsStateWrapper = innerState =>
  rhCloudStateWrapper({}, {}, innerState);
