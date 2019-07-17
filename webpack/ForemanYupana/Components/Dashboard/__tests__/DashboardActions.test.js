import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { startPolling, stopPolling, fetchLogs } from '../DashboardActions';
import { pollingProcessID } from '../Dashboard.fixtures';

const fixtures = {
  'should startPolling': () => startPolling(pollingProcessID),
  'should stopPolling': () => stopPolling(pollingProcessID),
  'should fetchLogs': () => fetchLogs(),
};

describe('Dashboard actions', () => testActionSnapshotWithFixtures(fixtures));
