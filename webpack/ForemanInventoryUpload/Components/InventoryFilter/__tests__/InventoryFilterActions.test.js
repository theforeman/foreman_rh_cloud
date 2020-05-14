import { testActionSnapshotWithFixtures } from '@theforeman/test';
import {
  handleFilterChange,
  handleFilterClear,
} from '../InventoryFilterActions';
import { filterTerm } from '../InventoryFilter.fixtures';

const fixtures = {
  'should handleFilterChange': () => handleFilterChange(filterTerm),
  'should handleFilterClear': () => handleFilterClear(),
};

describe('InventoryFilter actions', () =>
  testActionSnapshotWithFixtures(fixtures));
