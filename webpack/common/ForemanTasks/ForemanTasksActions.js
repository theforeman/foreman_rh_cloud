import React from 'react';
import { get } from 'foremanReact/redux/API';
import { withInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { addToast } from 'foremanReact/components/ToastsList';
import { translate as __ } from 'foremanReact/common/I18n';
import { foremanTaskDetailsUrl } from './ForemanTasksHelpers';
import { foremanUrl } from '../../ForemanRhCloudHelpers';

export const setupTaskPolling = ({
  taskId,
  key,
  onTaskSuccess,
  onTaskError,
  taskErrorMessage,
  dispatch,
}) =>
  withInterval(
    get({
      key,
      url: foremanTaskDetailsUrl(taskId),
      handleSuccess: ({ data }, stopTaskInterval) => {
        if (data.result === 'success') {
          stopTaskInterval();
          onTaskSuccess(data, dispatch);
        }
        if (data.result === 'error') {
          stopTaskInterval();
          if (taskErrorMessage === undefined) {
            taskErrorMessage = errorData =>
              `${__('The task failed with the following error:')} ${
                errorData.humanized.errors
              }`;
          }
          if (onTaskError === undefined) {
            onTaskError = errorData =>
              dispatch(defaultTaskErrorHandler(errorData, taskErrorMessage));
          }
          onTaskError(data, dispatch);
        }
      },
      errorToast: error => `Could not get task details: ${error}`,
    })
  );

export const taskRelatedToast = (taskID, type, message) =>
  addToast({
    type,
    message: (
      <span>
        {message}
        <br />
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

const defaultTaskErrorHandler = (data, taskErrorMessage) =>
  taskRelatedToast(data.id, 'error', taskErrorMessage(data));
