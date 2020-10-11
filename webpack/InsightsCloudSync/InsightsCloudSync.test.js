import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  render: {
    syncInsights: noop,
    settingsUrl: 'www.example.com/settings',
  },
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
