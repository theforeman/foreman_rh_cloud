import URI from 'urijs';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const insightsCloudUrl = path => foremanUrl(`/insights_cloud/${path}`);

export const cloudTokenSettingUrl = () => {
  const settingsUrl = new URI(foremanUrl('/settings'));
  settingsUrl.setSearch({ search: 'name = rh_cloud_token' });
  return settingsUrl.toString();
};
