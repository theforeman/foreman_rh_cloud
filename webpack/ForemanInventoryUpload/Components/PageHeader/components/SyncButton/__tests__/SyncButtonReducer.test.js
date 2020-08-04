import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer from '../SyncButtonReducer';
import { syncHosts, disconnectHosts, error } from './SyncButtonFixtures';
import {
  INVENTORY_SYNC_REQUEST,
  INVENTORY_SYNC_SUCCESS,
  INVENTORY_SYNC_FAILURE,
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
  'should handle INVENTORY_SYNC_FAILURE': {
    action: {
      type: INVENTORY_SYNC_FAILURE,
      payload: { error },
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
