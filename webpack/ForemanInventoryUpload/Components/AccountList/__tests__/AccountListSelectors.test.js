import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
  selectAutoUploadEnabled,
} from '../AccountListSelectors';
import {
  pollingProcessID,
  accounts,
  autoUploadEnabled,
} from '../AccountList.fixtures';
import { inventoryStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const state = inventoryStateWrapper({
  accountsList: {
    accounts,
    pollingProcessID,
    autoUploadEnabled,
  },
});

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList accounts': () => selectAccounts(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
  'should return AccountList autoUploadEnabled': () =>
    selectAutoUploadEnabled(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
