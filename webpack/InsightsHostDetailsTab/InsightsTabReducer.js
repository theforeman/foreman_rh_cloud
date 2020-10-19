import Immutable from 'seamless-immutable';
import { INSIGHTS_HITS_SUCCESS } from './InsightsTabConstants';

const initialState = Immutable({
  hits: [],
});

export default (state = initialState, action) => {
  const { payload: { hits } = {} } = action;

  switch (action.type) {
    case INSIGHTS_HITS_SUCCESS:
      return state.merge({
        hits,
      });
    default:
      return state;
  }
};
