import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import { DASHBOARD_CHANGE_BOOL } from '../DashboardConstants';
import reducer from '../DashboardReducer';

const fixtures = {
  'should return the initial state': {},
  'should handle DASHBOARD_CHANGE_BOOL': {
    action: {
      type: DASHBOARD_CHANGE_BOOL,
      payload: {
        bool: true,
      },
    },
  },
};

describe('Dashboard reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
