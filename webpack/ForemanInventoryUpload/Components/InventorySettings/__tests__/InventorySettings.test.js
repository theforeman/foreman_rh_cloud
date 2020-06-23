import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InventorySettings from '../InventorySettings';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('InventorySettings', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventorySettings, fixtures));
});
