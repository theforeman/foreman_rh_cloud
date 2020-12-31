import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import PageTitle from '../PageTitle';

const fixtures = {
  'render without Props': {},
};

describe('PageTitle', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(PageTitle, fixtures));
});
