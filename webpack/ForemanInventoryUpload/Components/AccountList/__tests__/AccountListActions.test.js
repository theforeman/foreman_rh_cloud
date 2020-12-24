import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { API } from 'foremanReact/redux/API';
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

jest.mock('foremanReact/redux/API');
API.get.mockImplementation(async () => fetchAccountsStatusResponse);

const fixtures = {
  'should fetchAccountsStatus': () => fetchAccountsStatus(),
  'should startAccountStatusPolling': () =>
    startAccountStatusPolling(pollingProcessID),
  'should stopAccountStatusPolling': () =>
    stopAccountStatusPolling(pollingProcessID),
  'should restartProcess': () => restartProcess(accountID, activeTab),
  'should invoke toast notification upon failure': () => {
    API.post.mockImplementationOnce(() =>
      Promise.reject(new Error('test error'))
    );

    return restartProcess(accountID, activeTab);
  },
};

describe('AccountList actions', () => testActionSnapshotWithFixtures(fixtures));
