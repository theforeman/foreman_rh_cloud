import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import EmptyResults from '../EmptyResults';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('EmptyResults', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(EmptyResults, fixtures));
});
