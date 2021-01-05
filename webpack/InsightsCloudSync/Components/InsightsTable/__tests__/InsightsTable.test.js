import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InsightsTable from '../InsightsTable';
import { tableProps } from './fixtures';

const fixtures = {
  'render with Props': tableProps,
};

describe('InsightsTable', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InsightsTable, fixtures));
});
