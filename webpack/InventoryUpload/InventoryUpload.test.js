import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import InventoryUpload from './InventoryUpload';

const fixtures = {
  'render without Props': {},
};

describe('InventoryUpload', () =>
  testComponentSnapshotsWithFixtures(InventoryUpload, fixtures));
