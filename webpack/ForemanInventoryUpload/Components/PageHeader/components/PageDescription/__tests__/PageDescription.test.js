import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { PageDescription } from '../PageDescription';

const fixtures = {
  'render without Props': {},
};

describe('PageDescription', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(PageDescription, fixtures));
});
