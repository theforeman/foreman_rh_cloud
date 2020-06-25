import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { insightsCloudUrl } from '../InsightsCloudSyncHelpers';

global.URL_PREFIX = '';

const fixtures = {
  'should return insights cloud Url': () => insightsCloudUrl('test_path'),
};

describe('InsightsCloudSync helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
