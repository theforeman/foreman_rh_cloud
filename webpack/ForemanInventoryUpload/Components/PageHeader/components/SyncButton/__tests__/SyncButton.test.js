import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import SyncButton from '../SyncButton';

const fixtures = {
  'render without Props': {},
};

describe('SyncButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(SyncButton, fixtures));
});
