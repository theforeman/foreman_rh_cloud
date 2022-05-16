import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'foremanReact/common/helpers';
import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  render: {
    status: 'RESOLVED',
    syncInsights: noop,
    fetchInsights: noop,
    query: '',
  },
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
