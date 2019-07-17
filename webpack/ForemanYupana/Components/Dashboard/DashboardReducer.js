import Immutable from 'seamless-immutable';

import { DASHBOARD_CHANGE_BOOL } from './DashboardConstants';

const initialState = Immutable({
  /** insert Dashboard state here */
  bool: false,
});

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case DASHBOARD_CHANGE_BOOL:
      return state.set('bool', payload.bool);

    default:
      return state;
  }
};
