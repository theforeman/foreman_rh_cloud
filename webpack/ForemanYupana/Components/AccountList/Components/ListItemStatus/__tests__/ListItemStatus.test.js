import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ListItemStatus from '../ListItemStatus';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('ListItemStatus', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ListItemStatus, fixtures));
});
