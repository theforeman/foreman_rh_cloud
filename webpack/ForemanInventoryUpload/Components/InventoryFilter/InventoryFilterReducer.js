import Immutable from 'seamless-immutable';
import { LAYOUT_CHANGE_ORG } from 'foremanReact/components/Layout/LayoutConstants';
import {
  INVENTORY_FILTER_UPDATE,
  INVENTORY_FILTER_CLEAR,
  ANY_ORGANIZATION,
} from './InventoryFilterConstants';

const initialState = Immutable({
  filterTerm: '',
});

export default (
  state = initialState,
  { type, payload: { filterTerm, org } = {} }
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
    case LAYOUT_CHANGE_ORG: {
      const { title } = org;
      const term = title === ANY_ORGANIZATION ? '' : title;
      return state.merge({
        filterTerm: term,
      });
    }
    default:
      return state;
  }
};
