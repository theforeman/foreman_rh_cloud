import Immutable from 'seamless-immutable';
import {
  INSIGHTS_HITS_SUCCESS,
  INSIGHTS_HITS_FAILURE,
} from './InsightsTabConstants';

const initialState = Immutable({
  hits: [],
});

export default (state = initialState, action) => {
  const { payload: { hits, error } = {} } = action;

  switch (action.type) {
    case INSIGHTS_HITS_SUCCESS:
      return state.merge({
        hits,
      });
    case INSIGHTS_HITS_FAILURE:
      return state.merge({
        error,
      });
    default:
      return state;
  }
};
