import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
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
