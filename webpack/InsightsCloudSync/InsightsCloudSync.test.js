import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'foremanReact/common/helpers';
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
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
