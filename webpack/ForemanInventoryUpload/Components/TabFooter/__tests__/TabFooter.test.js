import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import TabFooter from '../TabFooter';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabFooter', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabFooter, fixtures));
});
