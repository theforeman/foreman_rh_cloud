import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import ErrorState from '../ErrorState';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('ErrorState', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ErrorState, fixtures));
});
