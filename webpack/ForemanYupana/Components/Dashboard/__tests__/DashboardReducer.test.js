import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  YUPANA_POLLING_START,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
} from '../DashboardConstants';
import reducer from '../DashboardReducer';
import {
  pollingProcessID,
  logs,
  completed,
  initialState,
  files,
  activeTab,
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
  'should handle YUPANA_TAB_CHANGED': {
    action: {
      type: YUPANA_TAB_CHANGED,
      payload: {
        activeTab,
      },
    },
  },
};

describe('Dashboard reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
