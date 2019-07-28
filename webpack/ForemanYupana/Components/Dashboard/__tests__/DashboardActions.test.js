import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import {
  startPolling,
  stopPolling,
  fetchLogs,
  setActiveTab,
  downloadReports,
  restartProcess,
} from '../DashboardActions';
import { pollingProcessID, serverMock, activeTab } from '../Dashboard.fixtures';

jest.mock('foremanReact/API');
API.get.mockImplementation(() => serverMock);

const runWithGetState = (state, action, params) => dispatch => {
  const getState = () => ({
    dashboard: state,
  });
  action(params)(dispatch, getState);
};

const fixtures = {
  'should startPolling': () => startPolling(pollingProcessID),
  'should fetchLogs': () =>
    runWithGetState({ activeTab: 'uploads' }, fetchLogs),
  'should stopPolling': () => stopPolling(pollingProcessID),
  'should setActiveTab': () => setActiveTab(activeTab),
  'should downloadReports': () => downloadReports(),
  'should restartProcess': () => restartProcess(),
};

describe('Dashboard actions', () => testActionSnapshotWithFixtures(fixtures));
