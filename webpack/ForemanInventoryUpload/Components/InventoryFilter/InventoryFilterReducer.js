import Immutable from 'seamless-immutable';
import {
  LAYOUT_CHANGE_ORG,
  LAYOUT_INITIALIZE,
} from 'foremanReact/components/Layout/LayoutConstants';
import { translate as __ } from 'foremanReact/common/I18n';
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
  { type, payload: { filterTerm, organization } = {} }
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
    case LAYOUT_CHANGE_ORG:
    case LAYOUT_INITIALIZE: {
      const { title } = organization || {};
      // Any org is used only in it's translated form in the redux
      const term = title === __(ANY_ORGANIZATION) ? '' : title;
      return state.merge({
        filterTerm: term,
      });
    }
    default:
      return state;
  }
};
