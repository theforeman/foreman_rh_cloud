import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { inventoryStateWrapper } from '../ForemanRhCloudTestHelpers';

const fixtures = {
  'should return inventory wrapper': () =>
    inventoryStateWrapper({ inventoryChildren: null }),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
