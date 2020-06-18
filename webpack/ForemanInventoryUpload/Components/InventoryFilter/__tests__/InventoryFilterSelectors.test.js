import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import { filterTerm } from '../InventoryFilter.fixtures';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';
import {
  selectInventoryFilter,
  selectFilterTerm,
} from '../InventoryFilterSelectors';

const state = rhCloudStateWrapper({
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
