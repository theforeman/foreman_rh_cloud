import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { inventoryStateWrapper } from '../../../../../../ForemanRhCloudTestHelpers';
import {
  status,
  error,
  syncHosts,
  disconnectHosts,
} from './SyncButtonFixtures';
import {
  selectInventorySync,
  selectStatus,
  selectError,
  selectSyncHosts,
  selectDisconnectHosts,
} from '../SyncButtonSelectors';

const state = inventoryStateWrapper({
  inventorySync: {
    status,
    error,
    syncHosts,
    disconnectHosts,
  },
});

const fixtures = {
  'should return InventorySync': () => selectInventorySync(state),
  'should return InventorySync status': () => selectStatus(state),
  'should return InventorySync error': () => selectError(state),
  'should return InventorySync SyncHosts': () => selectSyncHosts(state),
  'should return InventorySync disconnectHosts': () =>
    selectDisconnectHosts(state),
};

describe('SyncButton selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
