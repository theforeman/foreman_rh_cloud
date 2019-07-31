import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import { ACCOUNTLIST_CHANGE_BOOL } from '../AccountListConstants';
import reducer from '../AccountListReducer';

const fixtures = {
  'should return the initial state': {},
  'should handle ACCOUNTLIST_CHANGE_BOOL': {
    action: {
      type: ACCOUNTLIST_CHANGE_BOOL,
      payload: {
        bool: true,
      },
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
