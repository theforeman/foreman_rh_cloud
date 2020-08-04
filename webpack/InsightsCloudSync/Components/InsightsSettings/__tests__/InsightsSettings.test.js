import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InsightsSettings from '../InsightsSettings';

const fixtures = {
  'render without Props': {
    insightsSyncEnabled: false,
    getInsightsSyncSettings: noop,
    setInsightsSyncEnabled: noop,
  },
  /** fixtures, props for the component */
};

describe('InsightsSettings', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InsightsSettings, fixtures));
});
