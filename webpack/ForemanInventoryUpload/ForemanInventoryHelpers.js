import { foremanUrl } from '../ForemanRhCloudHelpers';

export const inventoryUrl = path =>
  foremanUrl(`/foreman_inventory_upload/${path}`);
