import { selectInsightsCloudSync } from '../../../ForemanRhCloudSelectors';

export const selectSettings = state => selectInsightsCloudSync(state).settings;

export const selectInsightsSyncEnabled = state =>
  selectSettings(state).insightsSyncEnabled;
