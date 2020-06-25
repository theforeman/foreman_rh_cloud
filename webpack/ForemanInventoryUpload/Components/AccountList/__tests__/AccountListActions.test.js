import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import {
  fetchAccountsStatus,
  startAccountStatusPolling,
  stopAccountStatusPolling,
  restartProcess,
} from '../AccountListActions';
import {
  pollingProcessID,
  fetchAccountsStatusResponse,
} from '../AccountList.fixtures';
import { accountID, activeTab } from '../../Dashboard/Dashboard.fixtures';

jest.mock('foremanReact/API');
API.get.mockImplementation(async () => fetchAccountsStatusResponse);

const fixtures = {
  'should fetchAccountsStatus': () => fetchAccountsStatus(),
  'should startAccountStatusPolling': () =>
    startAccountStatusPolling(pollingProcessID),
  'should stopAccountStatusPolling': () =>
    stopAccountStatusPolling(pollingProcessID),
  'should restartProcess': () => restartProcess(accountID, activeTab),
};

describe('AccountList actions', () => testActionSnapshotWithFixtures(fixtures));
