import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  render: {
    status: 'RESOLVED',
    syncInsights: noop,
    fetchInsights: noop,
    query: '',
    hasToken: true,
  },
  'render no token': {
    status: 'RESOLVED',
    syncInsights: noop,
    fetchInsights: noop,
    hasToken: false,
  },
  'render error': {
    status: 'ERROR',
    syncInsights: noop,
    fetchInsights: noop,
  },
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
