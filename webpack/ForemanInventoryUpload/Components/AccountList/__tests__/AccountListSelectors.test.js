import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
} from '../AccountListSelectors';
import { pollingProcessID, accounts } from '../AccountList.fixtures';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const state = rhCloudStateWrapper({
  accountsList: {
    accounts,
    pollingProcessID,
  },
});

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList accounts': () => selectAccounts(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
