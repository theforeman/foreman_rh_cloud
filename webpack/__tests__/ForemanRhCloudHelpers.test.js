import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { foremanUrl } from '../ForemanRhCloudHelpers';

global.URL_PREFIX = 'MY_TEST_URL_PREFIX.example.com';

const fixtures = {
  'should return foreman Url': () => foremanUrl('/test_path'),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
