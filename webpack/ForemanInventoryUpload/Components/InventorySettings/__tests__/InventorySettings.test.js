import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import InventorySettings from '../InventorySettings';

const fixtures = {
  'render Props': {
    handleToggleRHInventory: jest.fn(),
    handleToggleCloudConnector: jest.fn(),
    rhInventory: true,
    cloudConnector: false,
  },
};

describe('InventorySettings', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventorySettings, fixtures));
});
