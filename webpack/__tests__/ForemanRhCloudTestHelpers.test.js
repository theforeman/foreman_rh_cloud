import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { rhCloudStateWrapper } from '../ForemanRhCloudTestHelpers';

const fixtures = {
  'should return inventory wrapper': () =>
    rhCloudStateWrapper({ inventoryChildren: null }),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
