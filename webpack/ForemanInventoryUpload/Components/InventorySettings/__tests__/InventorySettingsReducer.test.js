import { testReducerSnapshotWithFixtures } from '@theforeman/test';
import { RH_INVENTORY_TOGGLE } from '../InventorySettingsConstants';

import reducer from '../InventorySettingsReducer';

const fixtures = {
  'should handle RH_INVENTORY_TOGGLE false': {
    action: {
      type: RH_INVENTORY_TOGGLE,
      payload: {
        rhInventory: false,
      },
    },
  },
};

describe('Inventory settings reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
