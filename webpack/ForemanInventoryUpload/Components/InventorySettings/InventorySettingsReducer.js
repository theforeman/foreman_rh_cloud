import Immutable from 'seamless-immutable';
import {
  RH_INVENTORY_TOGGLE,
  CLOUD_CONNECTOR_TOGGLE,
} from './InventorySettingsConstants';

const initialState = Immutable({ cloudConnector: false, rhInventory: false });

export default (state = initialState, action) => {
  const { payload: { cloudConnector, rhInventory } = {} } = action;

  switch (action.type) {
    case RH_INVENTORY_TOGGLE:
      return state.merge({
        ...state,
        rhInventory,
      });
    case CLOUD_CONNECTOR_TOGGLE:
      return state.merge({
        ...state,
        cloudConnector,
      });
    default:
      return state;
  }
};
