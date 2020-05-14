import { testReducerSnapshotWithFixtures } from '@theforeman/test';
import reducer from '../InventoryFilterReducer';
import { filterTerm } from '../InventoryFilter.fixtures';
import {
  INVENTORY_FILTER_UPDATE,
  INVENTORY_FILTER_CLEAR,
} from '../InventoryFilterConstants';

const fixtures = {
  'should return the initial state': {},
  'should handle INVENTORY_FILTER_UPDATE': {
    action: {
      type: INVENTORY_FILTER_UPDATE,
      payload: {
        filterTerm,
      },
    },
  },
  'should handle INVENTORY_FILTER_CLEAR': {
    action: {
      type: INVENTORY_FILTER_CLEAR,
      payload: {},
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
