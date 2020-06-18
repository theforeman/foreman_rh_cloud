import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import DocsButton from '../DocsButton';

const fixtures = {
  'render without Props': {},
};

describe('DocsButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(DocsButton, fixtures));
});
