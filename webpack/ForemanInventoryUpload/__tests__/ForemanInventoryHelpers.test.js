import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { inventoryUrl } from '../ForemanInventoryHelpers';

const fixtures = {
  'should return inventory Url': () => inventoryUrl('test_path'),
};

describe('ForemanInventoryUpload helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
