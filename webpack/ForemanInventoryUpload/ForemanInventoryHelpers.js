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

export const getTasksHistoryUrl = () =>
  foremanUrl(
    '/foreman_tasks/tasks?search=action++%3D++ForemanInventoryUpload%3A%3AAsync%3A%3AGenerateReportJob+or+action++%3D++ForemanInventoryUpload%3A%3AAsync%3A%3AGenerateAllReportsJob&page=1'
  );
