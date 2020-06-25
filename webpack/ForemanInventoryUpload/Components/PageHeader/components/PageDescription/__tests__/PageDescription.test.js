import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { PageDescription } from '../PageDescription';

const fixtures = {
  'render without Props': {},
};

describe('PageDescription', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(PageDescription, fixtures));
});
