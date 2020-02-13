import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
} from '../AccountListSelectors';
import { pollingProcessID, accounts } from '../AccountList.fixtures';

const state = {
  ForemanInventoryUpload: {
    accountsList: {
      accounts,
      pollingProcessID,
    },
  },
};

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList accounts': () => selectAccounts(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
