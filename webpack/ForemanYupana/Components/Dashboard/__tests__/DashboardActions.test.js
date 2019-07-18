import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { startPolling, fetchLogs } from '../DashboardActions';
import { pollingProcessID } from '../Dashboard.fixtures';

const fixtures = {
  'should startPolling': () => startPolling(pollingProcessID),
  'should fetchLogs': () => fetchLogs(),
  /**  TypeError: getState is not a function */
  // 'should stopPolling': () => stopPolling(pollingProcessID),
};

describe('Dashboard actions', () => testActionSnapshotWithFixtures(fixtures));
