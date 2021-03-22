import React from 'react';
import { get, post } from 'foremanReact/redux/API';
import { withInterval } from 'foremanReact/redux/middlewares/IntervalMiddleware';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { translate as __ } from 'foremanReact/common/I18n';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';
import Toast from './components/Toast';
import {
  INVENTORY_SYNC,
  INVENTORY_SYNC_TASK_UPDATE,
} from './SyncButtonConstants';
import { foremanUrl } from '../../../../../ForemanRhCloudHelpers';

export const handleSync = () => dispatch => {
  dispatch(
    post({
      key: INVENTORY_SYNC,
      url: inventoryUrl('tasks'),
      handleSuccess: ({
        data: {
          task: { id },
        },
      }) => {
        dispatch(getSyncTaskInterval(id));
        return dispatch(
          taskPageRefererToast(id, 'info', __('Inventory sync has started:'))
        );
      },
      errorToast: inventorySyncErrorToast,
    })
  );
};

export const getSyncTaskInterval = id => dispatch => {
  dispatch(
    withInterval(
      get({
        key: INVENTORY_SYNC_TASK_UPDATE,
        url: inventoryUrl(`tasks/${id}`),
        handleSuccess: ({ data: { result, output } }, stopTaskInterval) => {
          if (result === 'success') {
            const {
              host_statuses: { sync, disconnect },
            } = output;
            dispatch(
              addToast({
                sticky: true,
                type: 'success',
                message: (
                  <Toast syncHosts={sync} disconnectHosts={disconnect} />
                ),
              })
            );
          }
          if (result === 'error') {
            dispatch(
              taskPageRefererToast(
                id,
                'error',
                __('Inventory sync has failed:'),
                true
              )
            );
          }
          stopTaskInterval();
        },
        errorToast: inventorySyncErrorToast,
      })
    )
  );
};

const inventorySyncErrorToast = ({ message, response }) =>
  `${__('Inventory sync has failed: ')} ${response.data?.message || message}`;

const taskPageRefererToast = (taskID, toastType, prefix, sticky = false) =>
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
