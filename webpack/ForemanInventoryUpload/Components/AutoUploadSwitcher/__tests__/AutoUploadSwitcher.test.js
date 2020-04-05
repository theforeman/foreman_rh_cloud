import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { noop } from 'patternfly-react';

import AutoUploadSwitcher from '../AutoUploadSwitcher';

const fixtures = {
  'render with props': { autoUploadEnabled: true, handleToggle: noop },
  /** fixtures, props for the component */
};

describe('AutoUploadSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(AutoUploadSwitcher, fixtures));
});
