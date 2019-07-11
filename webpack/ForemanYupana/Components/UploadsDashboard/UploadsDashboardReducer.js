import Immutable from 'seamless-immutable';

import { UPLOADSDASHBOARD_CHANGE_BOOL } from './UploadsDashboardConstants';

const initialState = Immutable({
  /** insert UploadsDashboard state here */
  bool: false,
});

export default (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case UPLOADSDASHBOARD_CHANGE_BOOL:
      return state.set('bool', payload.bool);

    default:
      return state;
  }
};
