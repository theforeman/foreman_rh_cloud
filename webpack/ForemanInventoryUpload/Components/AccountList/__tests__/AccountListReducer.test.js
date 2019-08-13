import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  INVENTORY_ACCOUNT_STATUS_POLLING,
  INVENTORY_ACCOUNT_STATUS_POLLING_START,
  INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
  INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
} from '../AccountListConstants';
import reducer from '../AccountListReducer';
import { statuses, error, pollingProcessID } from '../AccountList.fixtures';

const fixtures = {
  'should return the initial state': {},
  'should handle INVENTORY_ACCOUNT_STATUS_POLLING': {
    action: {
      type: INVENTORY_ACCOUNT_STATUS_POLLING,
      payload: {
        statuses,
      },
    },
  },
  'should handle INVENTORY_ACCOUNT_STATUS_POLLING_ERROR': {
    action: {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_ERROR,
      payload: { error },
    },
  },
  'should handle INVENTORY_ACCOUNT_STATUS_POLLING_START': {
    action: {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_START,
      payload: {
        pollingProcessID,
      },
    },
  },
  'should handle INVENTORY_ACCOUNT_STATUS_POLLING_STOP': {
    action: {
      type: INVENTORY_ACCOUNT_STATUS_POLLING_STOP,
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
