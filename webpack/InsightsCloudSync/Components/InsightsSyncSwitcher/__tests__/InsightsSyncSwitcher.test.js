import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InsightsSyncSwitcher from '../InsightsSyncSwitcher';

const fixtures = {
  'render with props': {
    insightsSyncEnabled: true,
    setInsightsSyncEnabled: noop,
  },
  /** fixtures, props for the component */
};

describe('InsightsSyncSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InsightsSyncSwitcher, fixtures));
});
