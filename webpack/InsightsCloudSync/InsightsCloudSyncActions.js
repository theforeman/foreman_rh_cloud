import React from 'react';
import { get, post } from 'foremanReact/redux/API';
import { withInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  insightsCloudUrl,
  foremanTaskDetailsUrl,
} from './InsightsCloudSyncHelpers';
import {
  INSIGHTS_CLOUD_SYNC,
  INSIGHTS_CLOUD_SYNC_TASK,
} from './InsightsCloudSyncConstants';
import { foremanUrl } from '../ForemanRhCloudHelpers';

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
        dispatch(setupTaskPolling(id, fetchInsights, query));
      },
      errorToast: error => syncInsightsError(error),
    })
  );

const syncInsightsError = error =>
  `${__('Recommendation sync has failed: ')} ${error}`;

const syncInsightsErrorToast = (taskID, toastType, prefix, sticky = false) =>
  addToast({
    sticky,
    type: toastType,
    message: (
      <span>
        {prefix}{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={foremanUrl(`/foreman_tasks/tasks/${taskID}`)}
        >
          {__('view the task page for more details')}
        </a>
      </span>
    ),
  });

const syncInsightsStartedToast = taskID =>
  addToast({
    sticky: false,
    type: 'info',
    message: (
      <span>
        {__('Recommendation sync has started: ')}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={foremanUrl(`/foreman_tasks/tasks/${taskID}`)}
        >
          {__('view the task in progress')}
        </a>
      </span>
    ),
  });

export const setupTaskPolling = (taskId, fetchInsights, query) => dispatch => {
  dispatch(
    withInterval(
      get({
        key: INSIGHTS_CLOUD_SYNC_TASK,
        url: foremanTaskDetailsUrl(taskId),
        handleSuccess: (
          {
            data: {
              result,
              humanized: { errors },
            },
          },
          stopTaskInterval
        ) => {
          if (result === 'success') {
            stopTaskInterval();
            dispatch(fetchInsights({ query, page: 1 }));
          }
          if (result === 'error') {
            stopTaskInterval();
            dispatch(
              syncInsightsErrorToast(
                taskId,
                'error',
                syncInsightsError(errors[0]),
                true
              )
            );
          }
        },
      })
    )
  );
};
