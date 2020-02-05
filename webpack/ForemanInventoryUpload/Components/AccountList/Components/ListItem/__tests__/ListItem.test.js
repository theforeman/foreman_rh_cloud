import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import ListItem from '../ListItem';
import { props } from '../ListItem.fixtures';

const fixtures = {
  'render with Props': props,
};

describe('ListItem', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ListItem, fixtures));
});
