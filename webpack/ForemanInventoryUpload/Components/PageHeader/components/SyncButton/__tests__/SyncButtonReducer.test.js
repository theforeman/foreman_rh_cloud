import { testReducerSnapshotWithFixtures } from '@theforeman/test';
import reducer from '../SyncButtonReducer';
import { syncHosts, disconnectHosts } from './SyncButtonFixtures';
import {
  INVENTORY_SYNC_REQUEST,
  INVENTORY_SYNC_SUCCESS,
} from '../SyncButtonConstants';

const fixtures = {
  'should return the initial state': {},
  'should handle INVENTORY_SYNC_REQUEST': {
    action: {
      type: INVENTORY_SYNC_REQUEST,
      payload: {},
    },
  },
  'should handle INVENTORY_SYNC_SUCCESS': {
    action: {
      type: INVENTORY_SYNC_SUCCESS,
      payload: { syncHosts, disconnectHosts },
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
