import { foremanUrl } from '../ForemanRhCloudHelpers';

export const inventoryUrl = path =>
  foremanUrl(`/foreman_inventory_upload/${path}`);

export const getInventoryDocsUrl = () =>
  'https://access.redhat.com/products/subscription-central';
