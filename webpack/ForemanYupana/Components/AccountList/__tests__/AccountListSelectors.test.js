import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectAccountsList,
  selectStatuses,
  selectPollingProcessID,
} from '../AccountListSelectors';
import { pollingProcessID, statuses } from '../AccountList.fixtures';

const state = {
  ForemanYupana: {
    accountsList: {
      statuses,
      pollingProcessID,
    },
  },
};

const fixtures = {
  'should return AccountsList': () => selectAccountsList(state),
  'should return AccountList statuses': () => selectStatuses(state),
  'should return AccountList pollingProcessID': () =>
    selectPollingProcessID(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
