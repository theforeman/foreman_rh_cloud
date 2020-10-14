import { testActionSnapshotWithFixtures } from '@theforeman/test';
import API from 'foremanReact/API';
import { handleSync } from '../SyncButtonActions';
import { successResponse } from './SyncButtonFixtures';

jest.mock('foremanReact/API');
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
      const customError = new Error();
      customError.response = {
        data: { message: 'Custom error to display in a toast' },
      };
      return Promise.reject(customError);
    });

    return handleSync();
  },
};

describe('SyncButton actions', () => testActionSnapshotWithFixtures(fixtures));
