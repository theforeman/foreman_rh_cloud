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
  initialState,
  activeTab,
  error,
  accountID,
  exitCode,
} from '../Dashboard.fixtures';

const fixtures = {
  'should return the initial state': initialState,
  'should handle YUPANA_POLLING_START': {
    action: {
      type: YUPANA_POLLING_START,
      payload: {
        pollingProcessID,
        accountID,
      },
    },
  },
  'should handle YUPANA_POLLING': {
    action: {
      type: YUPANA_POLLING,
      payload: {
        logs,
        exitCode,
        accountID,
        activeTab,
      },
    },
  },
  'should handle YUPANA_TAB_CHANGED': {
    action: {
      type: YUPANA_TAB_CHANGED,
      payload: {
        activeTab,
        accountID,
      },
    },
  },
  'should handle YUPANA_POLLING_ERROR': {
    action: {
      type: YUPANA_POLLING_ERROR,
      payload: {
        error,
        accountID,
        activeTab,
      },
    },
  },
};

describe('Dashboard reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
