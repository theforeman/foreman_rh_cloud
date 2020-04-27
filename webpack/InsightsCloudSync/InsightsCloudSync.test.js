import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  'render without Props': {},
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
