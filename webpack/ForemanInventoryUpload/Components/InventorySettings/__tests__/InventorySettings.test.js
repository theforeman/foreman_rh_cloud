import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InventorySettings from '../InventorySettings';

const fixtures = {
  'render Props': {
    handleToggleRHInventory: jest.fn(),
    rhInventory: true,
  },
};

describe('InventorySettings', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventorySettings, fixtures));
});
