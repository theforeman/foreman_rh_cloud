import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import UploadsDashboard from '../UploadsDashboard';
import * as props from '../UploadsDashboard.fixtures';

const fixtures = {
  'render without Props': {},
  'with props': props,
};

describe('UploadsDashboard', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(UploadsDashboard, fixtures));
});
