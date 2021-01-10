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
  { type, payload: { filterTerm, org, organization } = {} }
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
      // Any org is used only in it's translated form in the redux
      const term = title === __(ANY_ORGANIZATION) ? '' : title;
      return state.merge({
        filterTerm: term,
      });
    }
    case LAYOUT_INITIALIZE: {
      // Layout action changed in Jul 20 2020 - https://github.com/theforeman/foreman/commit/e4c39a7d8f8b50ba45ef63e46f6f6914b69f247a
      const { title } = organization; // org was renamed
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
