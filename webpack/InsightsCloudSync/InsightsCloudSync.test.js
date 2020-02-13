import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  'render without Props': {},
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
