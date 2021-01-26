import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import CloudConnectorSwitcher from '../CloudConnectorSwitcher';

const fixtures = {
  render: { handleToggle: jest.fn() },
};

describe('CloudConnectorSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(CloudConnectorSwitcher, fixtures));
});
