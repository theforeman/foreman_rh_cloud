import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import TabHeader from '../TabHeader';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabHeader', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabHeader, fixtures));
});
