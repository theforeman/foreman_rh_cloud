import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  rhCloudStateWrapper,
  inventoryStateWrapper,
  insightsStateWrapper,
} from '../ForemanRhCloudTestHelpers';

const fixtures = {
  'should return rhCloud wrapper': () =>
    rhCloudStateWrapper({ inventoryChild: {} }, { insightsChild: {} }),

  'should return inventory wrapper': () =>
    inventoryStateWrapper({ inventoryChild: {} }),

  'should return insights wrapper': () =>
    insightsStateWrapper({ insightsChild: {} }),
};

describe('ForemanRhCloud helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
