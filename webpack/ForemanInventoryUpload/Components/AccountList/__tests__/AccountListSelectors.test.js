import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
  selectCloudToken,
} from '../AccountListSelectors';
import {
  pollingProcessID,
  accounts,
  cloudToken,
} from '../AccountList.fixtures';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const state = rhCloudStateWrapper({
  accountsList: {
    accounts,
    pollingProcessID,
    cloudToken,
  },
});

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList accounts': () => selectAccounts(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
  'should return AccountList cloudToken': () => selectCloudToken(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
