import React from 'react';
import API from 'foremanReact/API';
import { addToast } from 'foremanReact/redux/actions/toasts';
import { inventoryUrl } from '../../../../ForemanInventoryHelpers';
import Toast from './components/Toast';
import {
  SYNCING_REQUEST,
  SYNCING_SUCCESS,
  SYNCING_FAILURE,
} from './SyncButtonConstants';

export const handleSync = () => async dispatch => {
  dispatch({
    type: SYNCING_REQUEST,
    payload: {},
  });
  try {
    const {
      data: { syncHosts, disconnectHosts },
    } = await API.post(inventoryUrl('tasks'));
    dispatch({
      type: SYNCING_SUCCESS,
      payload: {
        syncHosts,
        disconnectHosts,
      },
    });

    dispatch(
      addToast({
        sticky: true,
        type: 'success',
        title: 'Sync process ended successfully',
        message: (
          <Toast syncHosts={syncHosts} disconnectHosts={disconnectHosts} />
        ),
      })
    );
  } catch (error) {
    dispatch({
      type: SYNCING_FAILURE,
      payload: {
        error: error.message,
      },
    });
  }
};
