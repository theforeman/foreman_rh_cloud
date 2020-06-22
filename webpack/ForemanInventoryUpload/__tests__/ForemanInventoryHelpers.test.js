import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { inventoryUrl, getInventoryDocsUrl } from '../ForemanInventoryHelpers';

global.URL_PREFIX = '';

const fixtures = {
  'should return inventory Url': () => inventoryUrl('test_path'),
  'should return inventory docs url': () => getInventoryDocsUrl(),
};

describe('ForemanInventoryUpload helpers', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
