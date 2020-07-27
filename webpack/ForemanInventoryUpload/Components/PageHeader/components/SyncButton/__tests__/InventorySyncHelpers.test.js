import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { inventorySyncUrl } from '../SyncButtonHelpers';

const fixtures = {
  'should return insights cloud Url': () => inventorySyncUrl('test_path'),
};

describe('SyncButton helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
