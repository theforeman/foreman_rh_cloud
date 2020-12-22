import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { API } from 'foremanReact/redux/API';
import { handleSync } from '../SyncButtonActions';
import { successResponse } from './SyncButtonFixtures';

jest.mock('foremanReact/redux/API');
API.post.mockImplementation(async () => successResponse);

const fixtures = {
  'should handleSync': () => handleSync(),
  'should handleSync with error message': () => {
    API.post.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error!'))
    );

    return handleSync();
  },
  'should handleSync with custom error message': () => {
    API.post.mockImplementationOnce(() => {
      const customError = new Error('Server error!');
      customError.response = {
        data: { message: 'Custom error to display in a toast' },
      };
      return Promise.reject(customError);
    });

    return handleSync();
  },
};

describe('SyncButton actions', () => testActionSnapshotWithFixtures(fixtures));
