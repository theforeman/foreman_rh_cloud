import { foremanUrl } from '../ForemanRhCloudHelpers';

export const inventoryUrl = path =>
  foremanUrl(`/foreman_inventory_upload/${path}`);

export const getInventoryDocsUrl = () =>
  'https://access.redhat.com/products/subscription-central';

export const getActionsHistoryUrl = () =>
  foremanUrl(
    '/foreman_tasks/tasks?search=action++%3D++ForemanInventoryUpload%3A%3AAsync%3A%3AGenerateReportJob+or+action++%3D++ForemanInventoryUpload%3A%3AAsync%3A%3AGenerateAllReportsJob&page=1'
  );

export const isExitCodeLoading = exitCode => {
  const exitCodeLC = exitCode.toLowerCase();
  return (
    exitCodeLC.indexOf('running') !== -1 ||
    exitCodeLC.indexOf('restarting') !== -1
  );
};
