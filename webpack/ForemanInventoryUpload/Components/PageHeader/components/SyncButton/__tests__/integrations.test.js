import React from 'react';
import { IntegrationTestHelper } from '@theforeman/test';
import * as API from 'foremanReact/redux/API';
import { noop } from 'foremanReact/common/helpers';
import SyncButton from '../index';
import { successResponse } from './SyncButtonFixtures';
import {
  INVENTORY_SYNC,
  INVENTORY_SYNC_TASK_UPDATE,
} from '../SyncButtonConstants';

jest.spyOn(API, 'post');
jest.spyOn(API, 'get');

describe('SyncButton integration test', () => {
  it('Successful task was triggered on the server resulting in an info toast and polling on the task', async () => {
    API.post.mockImplementation(({ handleSuccess = noop, key, ...action }) => {
      if (key === INVENTORY_SYNC) {
        handleSuccess(successResponse);
      }
      return { type: 'API_POST', ...action };
    });
    API.get.mockImplementation(({ handleSuccess = noop, key, ...action }) => {
      if (key === INVENTORY_SYNC_TASK_UPDATE) {
        handleSuccess(
          {
            data: {
              endedAt: '2021-03-22T15:59:02.468+02:00',
              output: {
                host_statuses: {
                  sync: 0,
                  disconnect: 2,
                },
              },
              result: 'success',
            },
          },
          jest.fn
        );
      }
      return { type: 'API_GET', ...action };
    });

    const integrationTestHelper = new IntegrationTestHelper();
    const wrapper = integrationTestHelper.mount(<SyncButton />);
    const instance = wrapper.find('SyncButton').instance();
    instance.props.handleSync();
    await IntegrationTestHelper.flushAllPromises();
    integrationTestHelper.takeActionsSnapshot('handleSync was called');
  });
});
