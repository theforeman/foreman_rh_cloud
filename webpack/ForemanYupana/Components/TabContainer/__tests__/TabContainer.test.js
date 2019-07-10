import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import TabContainer from '../TabContainer';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('TabContainer', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(TabContainer, fixtures));
});
