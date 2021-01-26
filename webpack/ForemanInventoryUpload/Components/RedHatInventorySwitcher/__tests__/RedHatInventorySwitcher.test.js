import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import RedHatInventorySwitcher from '../RedHatInventorySwitcher';

const fixtures = {
  render: { handleToggle: jest.fn() },
};

describe('RedHatInventorySwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(RedHatInventorySwitcher, fixtures));
});
