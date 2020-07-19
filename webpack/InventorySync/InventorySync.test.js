import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InventorySync from './InventorySync';

const fixtures = {
  render: {
    syncInventory: noop,
    data: {
      settingsUrl: 'www.example.com/settings',
    },
  },
};

describe('InventorySync', () =>
  testComponentSnapshotsWithFixtures(InventorySync, fixtures));
