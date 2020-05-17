import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import EmptyResults from '../EmptyResults';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('EmptyResults', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(EmptyResults, fixtures));
});
