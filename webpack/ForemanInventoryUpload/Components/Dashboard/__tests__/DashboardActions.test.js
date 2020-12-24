import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { API } from 'foremanReact/redux/API';
import {
  startPolling,
  stopPolling,
  fetchLogs,
  setActiveTab,
  downloadReports,
  toggleFullScreen,
} from '../DashboardActions';
import {
  pollingProcessID,
  serverMock,
  activeTab,
  accountID,
} from '../Dashboard.fixtures';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

jest.mock('foremanReact/redux/API');
API.get.mockImplementation(() => serverMock);

const runWithGetState = (state, action, params) => dispatch => {
  const getState = () => rhCloudStateWrapper({ dashboard: state });
  action(params)(dispatch, getState);
};

const fixtures = {
  'should startPolling': () => startPolling(accountID, pollingProcessID),
  'should fetchLogs': () =>
    runWithGetState({ activeTab: 'uploads' }, fetchLogs, accountID),
  'should stopPolling': () => stopPolling(accountID, pollingProcessID),
  'should setActiveTab': () => setActiveTab(accountID, activeTab),
  'should downloadReports': () => downloadReports(accountID),
  'should toggleFullScreen': () =>
    runWithGetState({ activeTab: 'reports' }, toggleFullScreen, accountID),
};

describe('Dashboard actions', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { href: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  return testActionSnapshotWithFixtures(fixtures);
});
