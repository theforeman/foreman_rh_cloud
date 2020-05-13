import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { inventoryUrl } from '../ForemanInventoryHelpers';

global.URL_PREFIX = '';

const fixtures = {
  'should return inventory Url': () => inventoryUrl('test_path'),
};

describe('ForemanInventoryUpload helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
