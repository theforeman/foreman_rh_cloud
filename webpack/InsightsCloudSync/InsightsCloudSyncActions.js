import { post } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { insightsCloudUrl } from './InsightsCloudSyncHelpers';
import {
  INSIGHTS_CLOUD_SYNC,
  INSIGHTS_CLOUD_SYNC_TASK,
} from './InsightsCloudSyncConstants';
import { setupTaskPolling, taskRelatedToast } from '../common/ForemanTasks';

export const syncInsights = (fetchInsights, query) => dispatch =>
  dispatch(
    post({
      key: INSIGHTS_CLOUD_SYNC,
      url: insightsCloudUrl('tasks'),
      handleSuccess: ({
        data: {
          task: { id },
        },
      }) => {
        dispatch(syncInsightsStartedToast(id));
        dispatch(setupInsightsTaskPolling(id, fetchInsights, query, dispatch));
      },
      errorToast: error => syncInsightsError(error),
    })
  );

const syncInsightsError = error =>
  `${__('Recommendation sync has failed: ')} ${error}`;

const syncInsightsStartedToast = taskId =>
  taskRelatedToast(taskId, 'info', __('Recommendation sync has started: '));

const setupInsightsTaskPolling = (taskId, fetchInsights, query, dispatch) =>
  setupTaskPolling({
    taskId,
    key: INSIGHTS_CLOUD_SYNC_TASK,
    onTaskSuccess: () => {
      fetchInsights({ query, page: 1 });
      dispatch(
        taskRelatedToast(
          taskId,
          'success',
          __('Recommendations synced successfully')
        )
      );
    },
    taskErrorMessage: data => syncInsightsError(data.humanized.errors),
    dispatch,
  });
