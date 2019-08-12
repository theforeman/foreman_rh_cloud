import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  fetchAccountsStatus,
  startAccountStatusPolling,
  stopAccountStatusPolling,
} from '../AccountListActions';
import { pollingProcessID } from '../AccountList.fixtures';

const fixtures = {
  'should fetchAccountsStatus': () => fetchAccountsStatus(),
  'should startAccountStatusPolling': () =>
    startAccountStatusPolling(pollingProcessID),
  'should stopAccountStatusPolling': () =>
    stopAccountStatusPolling(pollingProcessID),
};

describe('AccountList actions', () => testActionSnapshotWithFixtures(fixtures));
