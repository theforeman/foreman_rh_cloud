import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import FileDownload from '../FileDownload';

const fixtures = {
  'render without Props': {},
  /** fixtures, props for the component */
};

describe('FileDownload', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(FileDownload, fixtures));
});
