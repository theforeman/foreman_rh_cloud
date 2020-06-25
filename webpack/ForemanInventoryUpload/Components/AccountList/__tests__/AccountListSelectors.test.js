import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
  selectAutoUploadEnabled,
  selectHostObfuscationEnabled,
} from '../AccountListSelectors';
import {
  pollingProcessID,
  accounts,
  autoUploadEnabled,
  hostObfuscationEnabled,
} from '../AccountList.fixtures';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const state = rhCloudStateWrapper({
  accountsList: {
    accounts,
    pollingProcessID,
    autoUploadEnabled,
    hostObfuscationEnabled,
  },
});

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList accounts': () => selectAccounts(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
  'should return AccountList autoUploadEnabled': () =>
    selectAutoUploadEnabled(state),
  'should return AccountList hostObfuscationEnabled': () =>
    selectHostObfuscationEnabled(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
