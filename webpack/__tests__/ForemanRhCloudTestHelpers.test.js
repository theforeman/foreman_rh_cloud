import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { rhCloudStateWrapper } from '../ForemanRhCloudTestHelpers';

const fixtures = {
  'should return inventory wrapper': () =>
    rhCloudStateWrapper({ inventoryChildren: null }),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
