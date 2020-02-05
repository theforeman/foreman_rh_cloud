import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import TabContainer from '../TabContainer';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabContainer', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabContainer, fixtures));
});
