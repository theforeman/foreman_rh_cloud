import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  YUPANA_ACCOUNT_STATUS_POLLING,
  YUPANA_ACCOUNT_STATUS_POLLING_START,
  YUPANA_ACCOUNT_STATUS_POLLING_STOP,
  YUPANA_ACCOUNT_STATUS_POLLING_ERROR,
} from '../AccountListConstants';
import reducer from '../AccountListReducer';
import { statuses, error, pollingProcessID } from '../AccountList.fixtures';

const fixtures = {
  'should return the initial state': {},
  'should handle YUPANA_ACCOUNT_STATUS_POLLING': {
    action: {
      type: YUPANA_ACCOUNT_STATUS_POLLING,
      payload: statuses,
    },
  },
  'should handle YUPANA_ACCOUNT_STATUS_POLLING_ERROR': {
    action: {
      type: YUPANA_ACCOUNT_STATUS_POLLING_ERROR,
      payload: error,
    },
  },
  'should handle YUPANA_ACCOUNT_STATUS_POLLING_START': {
    action: {
      type: YUPANA_ACCOUNT_STATUS_POLLING_START,
      payload: {
        pollingProcessID,
      },
    },
  },
  'should handle YUPANA_ACCOUNT_STATUS_POLLING_STOP': {
    action: {
      type: YUPANA_ACCOUNT_STATUS_POLLING_STOP,
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
