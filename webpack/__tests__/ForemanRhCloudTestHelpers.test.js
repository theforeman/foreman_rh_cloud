import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { inventoryStateWrapper } from '../ForemanRhCloudTestHelpers';

const fixtures = {
  'should return inventory wrapper': () =>
    inventoryStateWrapper({ inventoryChildren: null }),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
