import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import NavContainer from '../NavContainer';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('NavContainer', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(NavContainer, fixtures));
});
