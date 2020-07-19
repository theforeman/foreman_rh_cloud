import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { inventorySyncUrl } from '../InventorySyncHelpers';

const fixtures = {
  'should return insights cloud Url': () => inventorySyncUrl('test_path'),
};

describe('InventorySync helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
