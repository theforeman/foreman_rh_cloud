import {
  INVENTORY_FILTER_UPDATE,
  INVENTORY_FILTER_CLEAR,
} from './InventoryFilterConstants';

export const handleFilterChange = filterTerm => ({
  type: INVENTORY_FILTER_UPDATE,
  payload: {
    filterTerm,
  },
});

export const handleFilterClear = () => ({
  type: INVENTORY_FILTER_CLEAR,
  payload: {},
});
