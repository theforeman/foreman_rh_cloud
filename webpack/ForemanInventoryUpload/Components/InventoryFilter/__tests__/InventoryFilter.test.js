import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import { noop } from 'patternfly-react';

import InventoryFilter from '../InventoryFilter';

const fixtures = {
  'render with props': { handleFilterChange: noop },
  /** fixtures, props for the component */
};

describe('InventoryFilter', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventoryFilter, fixtures));
});
