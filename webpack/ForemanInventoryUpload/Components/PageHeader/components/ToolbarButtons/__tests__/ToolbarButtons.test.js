import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import ToolbarButtons from '../ToolbarButtons';

const fixtures = {
  'render without Props': {},
};

describe('ToolbarButtons', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ToolbarButtons, fixtures));
});
