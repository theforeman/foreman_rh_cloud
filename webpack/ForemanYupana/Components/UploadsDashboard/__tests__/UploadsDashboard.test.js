import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import UploadsDashboard from '../UploadsDashboard';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('UploadsDashboard', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(UploadsDashboard, fixtures));
});
