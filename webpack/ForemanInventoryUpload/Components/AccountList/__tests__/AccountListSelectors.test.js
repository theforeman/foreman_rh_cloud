import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
  selectIsAutoUpload,
} from '../AccountListSelectors';
import {
  pollingProcessID,
  accounts,
  isAutoUpload,
} from '../AccountList.fixtures';

const state = {
  ForemanInventoryUpload: {
    accountsList: {
      accounts,
      pollingProcessID,
      isAutoUpload,
    },
  },
};

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList accounts': () => selectAccounts(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
  'should return AccountList isAutoUpload': () => selectIsAutoUpload(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
