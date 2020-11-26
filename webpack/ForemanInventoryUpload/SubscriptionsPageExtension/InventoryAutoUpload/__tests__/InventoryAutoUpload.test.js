import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import InventoryAutoUpload from '../InventoryAutoUpload';

const fixtures = {
  'render with props': {
    autoUploadEnabled: true,
    handleToggle: noop,
    fetchSettings: noop,
  },
};

describe('InventoryAutoUpload', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventoryAutoUpload, fixtures));
});
