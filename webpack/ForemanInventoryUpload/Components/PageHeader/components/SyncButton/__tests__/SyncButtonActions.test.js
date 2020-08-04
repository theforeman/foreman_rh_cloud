import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import { handleSync } from '../SyncButtonActions';
import { successResponse } from './SyncButtonFixtures';

jest.mock('foremanReact/API');
API.post.mockImplementation(async () => successResponse);

const fixtures = {
  'should handleSync': () => handleSync(),
};

describe('SyncButton actions', () => testActionSnapshotWithFixtures(fixtures));
