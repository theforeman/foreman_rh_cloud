import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { noop } from 'patternfly-react';

import ExcludePackagesSwitcher from '../ExcludePackagesSwitcher';

const fixtures = {
  'render with props': { excludePackages: true, handleToggle: noop },
};

describe('ExcludePackagesSwitcher', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(ExcludePackagesSwitcher, fixtures));
});
