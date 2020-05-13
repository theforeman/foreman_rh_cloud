import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { foremanUrl } from '../ForemanRhCloudHelpers';

global.URL_PREFIX = 'MY_TEST_URL_PREFIX.example.com';

const fixtures = {
  'should return foreman Url': () => foremanUrl('/test_path'),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
