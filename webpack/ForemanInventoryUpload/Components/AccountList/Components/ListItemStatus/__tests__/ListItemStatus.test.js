import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

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
