import Immutable from 'seamless-immutable';
import {
  INVENTORY_FILTER_UPDATE,
  INVENTORY_FILTER_CLEAR,
} from './InventoryFilterConstants';

const initialState = Immutable({
  filterTerm: '',
});

export default (
  state = initialState,
  { type, payload: { filterTerm } = {} }
) => {
  switch (type) {
    case INVENTORY_FILTER_UPDATE:
      return state.merge({
        filterTerm,
      });
    case INVENTORY_FILTER_CLEAR:
      return state.merge({
        filterTerm: '',
      });
    default:
      return state;
  }
};
