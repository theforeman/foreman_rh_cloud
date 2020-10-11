import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import IpsObfuscationSwitcher from '../IpsObfuscationSwitcher';

const fixtures = {
  'render with props': { ipsObfuscationEnabled: true, handleToggle: noop },
};

describe('IpsObfuscationSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(IpsObfuscationSwitcher, fixtures));
});
