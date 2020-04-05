import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import PageHeader from '../PageHeader';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('PageHeader', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(PageHeader, fixtures));
});
