import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { inventoryStateWrapper } from '../ForemanInventoryUpload/ForemanInventoryHelpers';
import {
  selectForemanRhCloud,
  selectForemanInventoryUpload,
} from '../ForemanRhCloudSelectors';

const state = inventoryStateWrapper({ inventoryReducersNamespaces: {} });

const fixtures = {
  'should return ForemanRhCloud': () => selectForemanRhCloud(state),
  'should return ForemanInventoryUpload': () =>
    selectForemanInventoryUpload(state),
};

describe('ForemanRhCloud selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
