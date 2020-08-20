import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InsightsTab from '../InsightsTab';
import { props } from './InsightsTab.fixtures';

const fixtures = {
  'render with props': props,
};

describe('InsightsTab', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InsightsTab, fixtures));
});
