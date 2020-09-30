import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'patternfly-react';

import ExcludePackagesSwitcher from '../ExcludePackagesSwitcher';

const fixtures = {
  'render with props': { excludePackages: true, handleToggle: noop },
};

describe('ExcludePackagesSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ExcludePackagesSwitcher, fixtures));
});
