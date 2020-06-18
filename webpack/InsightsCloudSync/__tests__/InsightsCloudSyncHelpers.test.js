import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { insightsCloudUrl } from '../InsightsCloudSyncHelpers';

const fixtures = {
  'should return insights cloud Url': () => insightsCloudUrl('test_path'),
};

describe('InsightsCloudSync helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
