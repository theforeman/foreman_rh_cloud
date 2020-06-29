import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import InventorySettings from '../InventorySettings';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('InventorySettings', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventorySettings, fixtures));
});
