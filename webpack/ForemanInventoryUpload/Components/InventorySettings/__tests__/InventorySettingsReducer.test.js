import { testReducerSnapshotWithFixtures } from '@theforeman/test';
import {
  RH_INVENTORY_TOGGLE,
  CLOUD_CONNECTOR_TOGGLE,
} from '../InventorySettingsConstants';

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
  'should handle CLOUD_CONNECTOR_TOGGLE true': {
    action: {
      type: CLOUD_CONNECTOR_TOGGLE,
      payload: {
        cloudConnector: true,
      },
    },
  },
};

describe('Inventory settings reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
