import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ScheduledRun from '../ScheduledRun';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('ScheduledRun', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ScheduledRun, fixtures));
});
