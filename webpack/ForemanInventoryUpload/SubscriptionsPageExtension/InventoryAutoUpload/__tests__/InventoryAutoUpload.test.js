import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'foremanReact/common/helpers';

import InventoryAutoUpload from '../InventoryAutoUpload';

const fixtures = {
  'render with props': {
    autoUploadEnabled: true,
    setSetting: noop,
    getSettings: noop,
  },
};

describe('InventoryAutoUpload', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventoryAutoUpload, fixtures));
});
