import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ReportGenerate from '../ReportGenerate';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('ReportGenerate', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ReportGenerate, fixtures));
});
