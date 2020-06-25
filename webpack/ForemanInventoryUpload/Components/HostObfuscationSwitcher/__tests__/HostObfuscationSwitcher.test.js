import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { noop } from 'patternfly-react';

import HostObfuscationSwitcher from '../HostObfuscationSwitcher';

const fixtures = {
  'render with props': { hostObfuscationEnabled: true, handleToggle: noop },
  /** fixtures, props for the component */
};

describe('HostObfuscationSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(HostObfuscationSwitcher, fixtures));
});
