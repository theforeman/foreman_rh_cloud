import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import TabBody from '../TabBody';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabBody', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabBody, fixtures));
});
