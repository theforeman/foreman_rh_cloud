import { foremanUrl } from '../ForemanRhCloudHelpers';

export const insightsCloudUrl = path => foremanUrl(`/insights_cloud/${path}`);
