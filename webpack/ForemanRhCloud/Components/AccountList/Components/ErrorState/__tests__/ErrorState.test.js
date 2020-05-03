import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ErrorState from '../ErrorState';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('ErrorState', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ErrorState, fixtures));
});
