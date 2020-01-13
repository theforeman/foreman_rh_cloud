import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import ForemanInventoryUpload from './ForemanInventoryUpload';

const fixtures = {
  'render without Props': {},
};

describe('ForemanInventoryUpload', () =>
  testComponentSnapshotsWithFixtures(ForemanInventoryUpload, fixtures));
