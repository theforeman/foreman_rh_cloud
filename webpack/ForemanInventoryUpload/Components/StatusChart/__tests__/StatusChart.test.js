import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import StatusChart from '../StatusChart';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('StatusChart', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(StatusChart, fixtures));
});
