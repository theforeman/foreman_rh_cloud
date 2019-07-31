import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ListItem from '../ListItem';
import { props } from '../ListItem.fixtures';

const fixtures = {
  'render with Props': props,
};

describe('ListItem', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ListItem, fixtures));
});
