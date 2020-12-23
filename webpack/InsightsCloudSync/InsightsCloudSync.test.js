import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  render: {
    syncInsights: noop,
    query: '',
    fetchInsights: noop,
  },
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
