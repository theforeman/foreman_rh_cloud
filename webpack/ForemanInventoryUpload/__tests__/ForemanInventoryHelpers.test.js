import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { inventoryUrl, getInventoryDocsUrl } from '../ForemanInventoryHelpers';

const fixtures = {
  'should return inventory Url': () => inventoryUrl('test_path'),
  'should return inventory docs url': () => getInventoryDocsUrl(),
};

describe('ForemanInventoryUpload helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
