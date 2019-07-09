import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import Step from '../Step';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('Step', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(Step, fixtures));
});
