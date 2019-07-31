import Immutable from 'seamless-immutable';

import { ACCOUNTLIST_CHANGE_BOOL } from './AccountListConstants';

const initialState = Immutable({
  /** insert AccountList state here */
  bool: false,
});

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ACCOUNTLIST_CHANGE_BOOL:
      return state.set('bool', payload.bool);

    default:
      return state;
  }
};
