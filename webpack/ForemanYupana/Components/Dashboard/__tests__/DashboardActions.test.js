import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { startPolling } from '../DashboardActions';
import { pollingProcessID } from '../Dashboard.fixtures';

const fixtures = {
  'should startPolling': () => startPolling(pollingProcessID),
  /**  TypeError: getState is not a function - TODO: fix it for tests in foreman */
  // 'should fetchLogs': () => fetchLogs(),
  // 'should stopPolling': () => stopPolling(pollingProcessID),
};

describe('Dashboard actions', () => testActionSnapshotWithFixtures(fixtures));
