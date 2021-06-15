import { foremanUrl } from '../../ForemanRhCloudHelpers';

export const foremanTasksApiPath = path =>
  foremanUrl(`/foreman_tasks/api/tasks/${path}`);

export const foremanTaskDetailsUrl = id =>
  foremanTasksApiPath(`${id}/details?include_permissions`);
