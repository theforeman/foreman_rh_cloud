import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import TabFooter from '../TabFooter';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabFooter', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabFooter, fixtures));
});
