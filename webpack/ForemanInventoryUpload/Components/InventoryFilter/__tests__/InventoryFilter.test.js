import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'foremanReact/common/helpers';

import InventoryFilter from '../InventoryFilter';

const fixtures = {
  'render with props': { handleFilterChange: noop },
  /** fixtures, props for the component */
};

describe('InventoryFilter', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventoryFilter, fixtures));
});
