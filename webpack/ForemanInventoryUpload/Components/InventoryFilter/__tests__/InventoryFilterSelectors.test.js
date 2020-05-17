import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { filterTerm } from '../InventoryFilter.fixtures';
import { inventoryStateWrapper } from '../../../../ForemanRhCloudTestHelpers';
import {
  selectInventoryFilter,
  selectFilterTerm,
} from '../InventoryFilterSelectors';

const state = inventoryStateWrapper({
  inventoryFilter: {
    filterTerm,
  },
});

const fixtures = {
  'should return InventoryFilter': () => selectInventoryFilter(state),
  'should return filterTerm': () => selectFilterTerm(state),
};

describe('InventoryFilter selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
