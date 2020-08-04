import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
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
