import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import Terminal from '../Terminal';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('Terminal', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Terminal, fixtures));
});
