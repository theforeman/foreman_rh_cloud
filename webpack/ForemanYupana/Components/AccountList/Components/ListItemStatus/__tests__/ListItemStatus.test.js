import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ListItemStatus from '../ListItemStatus';
import { props } from '../ListItemStatus.fixtures';

const fixtures = {
  'render without Props': {},
  'render with Props': props,
};

describe('ListItemStatus', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ListItemStatus, fixtures));
});
