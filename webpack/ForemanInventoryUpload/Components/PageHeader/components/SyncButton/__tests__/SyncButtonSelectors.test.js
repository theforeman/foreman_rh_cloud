import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { selectTaskStatus } from '../SyncButtonSelectors';

const state = {
  API: {
    INVENTORY_SYNC_TASK_UPDATE: {
      response: {
        endedAt: '2021-03-08T14:27:30.718+02:00',
        output: {
          host_statuses: {
            sync: 0,
            disconnect: 2,
          },
        },
        result: 'pending',
      },
      status: 'RESOLVED',
    },
  },
};

const fixtures = {
  'should return InventorySync status': () => selectTaskStatus(state),
};

describe('SyncButton selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
