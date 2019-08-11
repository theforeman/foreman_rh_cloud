import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import EmptyState from '../EmptyState';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('EmptyState', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(EmptyState, fixtures));
});
