import { testReducerSnapshotWithFixtures } from '@theforeman/test';
import {
  LAYOUT_CHANGE_ORG,
  LAYOUT_INITIALIZE,
} from 'foremanReact/components/Layout/LayoutConstants';
import reducer from '../InventoryFilterReducer';
import { filterTerm, org } from '../InventoryFilter.fixtures';
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
  'should handle LAYOUT_CHANGE_ORG': {
    action: {
      type: LAYOUT_CHANGE_ORG,
      payload: { org },
    },
  },
  'should handle LAYOUT_INITIALIZE': {
    action: {
      type: LAYOUT_INITIALIZE,
      payload: { organization: org },
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
