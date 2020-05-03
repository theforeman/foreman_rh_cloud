import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import StatusChart from '../StatusChart';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('StatusChart', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(StatusChart, fixtures));
});
