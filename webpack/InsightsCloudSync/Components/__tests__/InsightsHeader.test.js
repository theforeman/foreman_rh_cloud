import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InsightsHeader from '../InsightsHeader';

const fixtures = {
  render: {},
};

describe('InsightsHeader', () =>
  testComponentSnapshotsWithFixtures(InsightsHeader, fixtures));
