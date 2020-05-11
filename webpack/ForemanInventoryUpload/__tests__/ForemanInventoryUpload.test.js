import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ForemanInventoryUpload from '../../ForemanInventoryUpload';

const fixtures = {
  'render without Props': {},
};

describe('ForemanInventoryUpload', () =>
  testComponentSnapshotsWithFixtures(ForemanInventoryUpload, fixtures));
