import URI from 'urijs';
import { foremanUrl } from '../ForemanRhCloudHelpers';

export const inventoryUrl = path =>
  foremanUrl(`/foreman_inventory_upload/${path}`);

export const getInventoryDocsUrl = () =>
  foremanUrl(
    `/links/manual/?root_url=${URI.encode(
      'https://docs.redhat.com/en/documentation/red_hat_lightspeed/1-latest/html-single/red_hat_lightspeed_remediations_guide/index'
    )}`
  );

export const getSubscriptionServiceDocsUrl = () =>
  foremanUrl(
    `/links/manual/?root_url=${URI.encode(
      'https://docs.redhat.com/en/documentation/subscription_central/1-latest/html-single/getting_started_with_the_subscriptions_service/index'
    )}`
  );

export const getActionsHistoryUrl = () =>
  foremanUrl(
    '/foreman_tasks/tasks?search=label+%3D+ForemanInventoryUpload%3A%3AAsync%3A%3AHostInventoryReportJob+or+label+%3D+ForemanInventoryUpload%3A%3AAsync%3A%3AGenerateAllReportsJob&page=1'
  );

export const isExitCodeLoading = exitCode => {
  const exitCodeLC = exitCode.toLowerCase();
  return (
    exitCodeLC.indexOf('running') !== -1 ||
    exitCodeLC.indexOf('restarting') !== -1
  );
};
