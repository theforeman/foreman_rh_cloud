import { testActionSnapshotWithFixtures } from '@theforeman/test';
import { syncInsights } from '../InsightsCloudSyncActions';

const fixtures = {
  'should syncInsights': () => syncInsights(),
};

describe('Insights cloud sync actions', () =>
  testActionSnapshotWithFixtures(fixtures));
