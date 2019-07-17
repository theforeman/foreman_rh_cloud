import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { changeBool } from '../DashboardActions';

const fixtures = {
  'should changeBool': () => changeBool({ bool: true }),
};

describe('Dashboard actions', () => testActionSnapshotWithFixtures(fixtures));
