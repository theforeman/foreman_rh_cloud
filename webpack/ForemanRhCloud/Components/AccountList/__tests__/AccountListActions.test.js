import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  fetchAccountsStatus,
  startAccountStatusPolling,
  stopAccountStatusPolling,
  restartProcess,
} from '../AccountListActions';
import { pollingProcessID } from '../AccountList.fixtures';
import { accountID, activeTab } from '../../Dashboard/Dashboard.fixtures';

const fixtures = {
  'should fetchAccountsStatus': () => fetchAccountsStatus(),
  'should startAccountStatusPolling': () =>
    startAccountStatusPolling(pollingProcessID),
  'should stopAccountStatusPolling': () =>
    stopAccountStatusPolling(pollingProcessID),
  'should restartProcess': () => restartProcess(accountID, activeTab),
};

describe('AccountList actions', () => testActionSnapshotWithFixtures(fixtures));
