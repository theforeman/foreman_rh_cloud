import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import { YUPANA_POLLING_START, YUPANA_POLLING } from '../DashboardConstants';
import reducer from '../DashboardReducer';
import {
  pollingProcessID,
  logs,
  completed,
  initialState,
  files,
} from '../Dashboard.fixtures';

const fixtures = {
  'should return the initial state': initialState,
  'should handle YUPANA_POLLING_START': {
    action: {
      type: YUPANA_POLLING_START,
      payload: {
        pollingProcessID,
      },
    },
  },
  'should handle YUPANA_POLLING': {
    action: {
      type: YUPANA_POLLING,
      payload: {
        logs,
        completed,
        files,
      },
    },
  },
};

describe('Dashboard reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
