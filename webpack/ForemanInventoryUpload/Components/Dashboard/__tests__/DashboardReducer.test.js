import { testReducerSnapshotWithFixtures } from '@theforeman/test';

import {
  INVENTORY_POLLING_START,
  INVENTORY_POLLING,
  INVENTORY_TAB_CHANGED,
  INVENTORY_POLLING_ERROR,
} from '../DashboardConstants';
import reducer from '../DashboardReducer';
import {
  pollingProcessID,
  logs,
  initialState,
  activeTab,
  error,
  accountID,
  scheduled,
} from '../Dashboard.fixtures';

const fixtures = {
  'should return the initial state': initialState,
  'should handle INVENTORY_POLLING_START': {
    action: {
      type: INVENTORY_POLLING_START,
      payload: {
        pollingProcessID,
        accountID,
      },
    },
  },
  'should handle INVENTORY_POLLING': {
    action: {
      type: INVENTORY_POLLING,
      payload: {
        logs,
        accountID,
        activeTab,
        scheduled,
      },
    },
  },
  'should handle INVENTORY_TAB_CHANGED': {
    action: {
      type: INVENTORY_TAB_CHANGED,
      payload: {
        activeTab,
        accountID,
      },
    },
  },
  'should handle INVENTORY_POLLING_ERROR': {
    action: {
      type: INVENTORY_POLLING_ERROR,
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
