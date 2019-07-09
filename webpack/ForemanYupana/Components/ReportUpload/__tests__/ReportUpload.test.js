import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ReportUpload from '../ReportUpload';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('ReportUpload', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ReportUpload, fixtures));
});
