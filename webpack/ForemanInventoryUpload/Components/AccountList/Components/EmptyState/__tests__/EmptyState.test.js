import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import EmptyState from '../EmptyState';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('EmptyState', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(EmptyState, fixtures));
});
