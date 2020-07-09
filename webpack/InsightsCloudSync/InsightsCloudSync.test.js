import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { noop } from 'patternfly-react';

import InsightsCloudSync from './InsightsCloudSync';

const fixtures = {
  render: {
    syncInsights: noop,
    data: {
      settingsUrl: 'www.example.com/settings',
    },
  },
};

describe('InsightsCloudSync', () =>
  testComponentSnapshotsWithFixtures(InsightsCloudSync, fixtures));
