import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  YUPANA_POLLING_START,
  YUPANA_POLLING,
  YUPANA_TAB_CHANGED,
  YUPANA_POLLING_ERROR,
} from '../DashboardConstants';
import reducer from '../DashboardReducer';
import {
  pollingProcessID,
  logs,
  completed,
  initialState,
  files,
  activeTab,
  error,
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
  'should handle YUPANA_POLLING_ERROR': {
    action: {
      type: YUPANA_POLLING_ERROR,
      payload: {
        error,
      },
    },
  },
};

describe('Dashboard reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
