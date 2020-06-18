import URI from 'urijs';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const inventoryUrl = path =>
  foremanUrl(`/foreman_inventory_upload/${path}`);

export const getInventoryDocsUrl = () =>
  foremanUrl(
    `/links/manual/+?root_url=${URI.encode(
      'https://access.redhat.com/products/subscription-central'
    )}`
  );
