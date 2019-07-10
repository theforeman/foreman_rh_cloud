import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import Tree from '../Tree';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('Tree', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Tree, fixtures));
});
