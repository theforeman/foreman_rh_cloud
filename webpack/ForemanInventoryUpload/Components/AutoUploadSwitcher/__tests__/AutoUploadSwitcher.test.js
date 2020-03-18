import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import AutoUploadSwitcher from '../AutoUploadSwitcher';

const fixtures = {
  'render with props': { isAutoUpload: true, handleToggle: noop },
  /** fixtures, props for the component */
};

describe('AutoUploadSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(AutoUploadSwitcher, fixtures));
});
