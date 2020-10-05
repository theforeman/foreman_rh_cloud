import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import {
  selectAccountsList,
  selectAccounts,
  selectPollingProcessID,
  selectAutoUploadEnabled,
  selectHostObfuscationEnabled,
  selectCloudToken,
  selectExcludePackages,
} from '../AccountListSelectors';
import {
  pollingProcessID,
  accounts,
  autoUploadEnabled,
  hostObfuscationEnabled,
  cloudToken,
  excludePackages,
} from '../AccountList.fixtures';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const state = rhCloudStateWrapper({
  accountsList: {
    accounts,
    pollingProcessID,
    autoUploadEnabled,
    hostObfuscationEnabled,
    cloudToken,
    excludePackages,
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
  'should return AccountList cloudToken': () => selectCloudToken(state),
  'should return AccountList excludePackages': () =>
    selectExcludePackages(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
