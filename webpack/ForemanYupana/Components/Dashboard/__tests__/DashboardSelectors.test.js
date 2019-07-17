import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectDashboard,
  selectCompleted,
  selectLogs,
  selectPollingProcessID,
} from '../DashboardSelectors';
import { logs, completed, pollingProcessID } from '../Dashboard.fixtures';

const state = {
  dashboard: {
    logs,
    completed,
    pollingProcessID,
  },
};

const fixtures = {
  'should return Dashboard': () => selectDashboard(state),
  'should return Dashboard completed': () => selectCompleted(state),
  'should return Dashboard logs': () => selectLogs(state),
  'should return Dashboard pollingProcessID': () =>
    selectPollingProcessID(state),
};

describe('Dashboard selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
