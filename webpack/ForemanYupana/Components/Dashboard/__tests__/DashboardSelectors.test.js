import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectDashboard,
  selectPollingProcessID,
  selectActiveTab,
  selectUploading,
  selectGenerating,
} from '../DashboardSelectors';
import {
  logs,
  completed,
  pollingProcessID,
  activeTab,
} from '../Dashboard.fixtures';

const state = {
  dashboard: {
    generating: {
      logs,
      completed,
    },
    uploading: {
      logs,
      completed,
    },
    activeTab,
    pollingProcessID,
  },
};

const fixtures = {
  'should return Dashboard': () => selectDashboard(state),
  'should return Dashboard uploading': () => selectUploading(state),
  'should return Dashboard generating': () => selectGenerating(state),
  'should return Dashboard pollingProcessID': () =>
    selectPollingProcessID(state),
  'should return Dashboard activeTab': () => selectActiveTab(state),
};

describe('Dashboard selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
