import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { selectAccountList, selectBool } from '../AccountListSelectors';

const state = {
  accountList: {
    bool: false,
  },
};

const fixtures = {
  'should return AccountList': () => selectAccountList(state),
  'should return AccountList bool': () => selectBool(state),
};

describe('AccountList selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
