import Immutable from 'seamless-immutable';
import { RH_INVENTORY_TOGGLE } from './InventorySettingsConstants';

const initialState = Immutable({ rhInventory: false });

export default (state = initialState, action) => {
  const { payload: { rhInventory } = {} } = action;

  switch (action.type) {
    case RH_INVENTORY_TOGGLE:
      return state.merge({
        ...state,
        rhInventory,
      });
    default:
      return state;
  }
};
