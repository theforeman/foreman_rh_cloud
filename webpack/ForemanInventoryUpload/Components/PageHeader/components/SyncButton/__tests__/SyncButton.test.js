import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import SyncButton from '../SyncButton';

const fixtures = {
  'render with Props': { cloudToken: '1234', handleSync: noop },
};

describe('SyncButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SyncButton, fixtures));
});
