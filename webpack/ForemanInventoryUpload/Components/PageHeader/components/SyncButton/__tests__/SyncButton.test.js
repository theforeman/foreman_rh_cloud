import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'foremanReact/common/helpers';

import SyncButton from '../SyncButton';

const fixtures = {
  'render with Props': { cloudToken: true, handleSync: noop },
};

describe('SyncButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SyncButton, fixtures));
});
