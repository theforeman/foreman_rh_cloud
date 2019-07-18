import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import Tree from '../Tree';
import { props } from '../Tree.fixtures';

const fixtures = {
  'render without Props': {},
  'render with props': props,
};

describe('Tree', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Tree, fixtures));
});
