import React from 'react';
import { post } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { translate as __ } from 'foremanReact/common/I18n';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';
import Toast from './components/Toast';
import {
  INVENTORY_SYNC,
  INVENTORY_SYNC_TASK_UPDATE,
} from './SyncButtonConstants';
import {
  setupTaskPolling,
  taskRelatedToast,
} from '../../../../../common/ForemanTasks';

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
        dispatch(setupInventorySyncTaskPolling(id, dispatch));
        return dispatch(
          taskRelatedToast(id, 'info', __('Inventory sync has started:'))
        );
      },
      errorToast: inventorySyncErrorToast,
    })
  );
};

export const setupInventorySyncTaskPolling = (id, dispatch) =>
  setupTaskPolling({
    taskId: id,
    key: INVENTORY_SYNC_TASK_UPDATE,
    onTaskSuccess: ({
      output: {
        host_statuses: { sync, disconnect },
      },
    }) =>
      dispatch(
        addToast({
          sticky: true,
          type: 'success',
          message: <Toast syncHosts={sync} disconnectHosts={disconnect} />,
        })
      ),
    dispatch,
  });

const inventorySyncErrorToast = message =>
  `${__('Inventory sync has failed: ')} ${message.response?.data?.message ||
    message}`;
