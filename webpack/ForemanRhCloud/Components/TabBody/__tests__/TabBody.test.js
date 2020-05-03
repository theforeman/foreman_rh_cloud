import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import TabBody from '../TabBody';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabBody', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabBody, fixtures));
});
