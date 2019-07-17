import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { selectDashboard, selectBool } from '../DashboardSelectors';

const state = {
  dashboard: {
    bool: false,
  },
};

const fixtures = {
  'should return Dashboard': () => selectDashboard(state),
  'should return Dashboard bool': () => selectBool(state),
};

describe('Dashboard selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
