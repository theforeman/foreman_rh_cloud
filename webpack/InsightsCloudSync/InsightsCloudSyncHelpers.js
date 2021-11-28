import URI from 'urijs';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const insightsCloudUrl = path => foremanUrl(`/insights_cloud/${path}`);

export const cloudTokenSettingUrl = () => {
  const settingsUrl = new URI(foremanUrl('/settings'));
  settingsUrl.setSearch({ search: 'name = rh_cloud_token' });
  return settingsUrl.toString();
};

export const redHatConsole = path => `https://console.redhat.com/${path}`;
export const redHatInsights = path => redHatConsole(`insights/${path}`);
export const redHatInventory = path => redHatInsights(`inventory/${path}`);
export const redHatAdvisor = path => redHatInsights(`advisor/${path}`);
export const redHatAdvisorSystems = path => redHatAdvisor(`systems/${path}`);
