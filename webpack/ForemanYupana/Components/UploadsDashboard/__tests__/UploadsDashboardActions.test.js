import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import { changeBool } from '../UploadsDashboardActions';

const fixtures = {
  'should changeBool': () => changeBool({ bool: true }),
};

describe('UploadsDashboard actions', () =>
  testActionSnapshotWithFixtures(fixtures));
