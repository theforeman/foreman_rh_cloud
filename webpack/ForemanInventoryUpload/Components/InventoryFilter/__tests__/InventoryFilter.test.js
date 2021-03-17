import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import { noop } from 'foremanReact/common/helpers';

import InventoryFilter from '../InventoryFilter';
import { filterTerm, organization } from '../InventoryFilter.fixtures';

const fixtures = {
  'render with props': {
    handleFilterChange: noop,
    handleFilterClear: noop,
    filterTerm,
    organization,
  },
  /** fixtures, props for the component */
};

describe('InventoryFilter', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(InventoryFilter, fixtures));
});
