import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { startPolling, fetchLogs } from '../DashboardActions';
import { pollingProcessID } from '../Dashboard.fixtures';

const fixtures = {
  'should startPolling': () => startPolling(pollingProcessID),
  'should fetchLogs': () => fetchLogs(),
  // 'should stopPolling': () => stopPolling(pollingProcessID),
};

describe('Dashboard actions', () => testActionSnapshotWithFixtures(fixtures));
