import Immutable from 'seamless-immutable';
import reducer from '../InsightsTabReducer';
import { hits } from './InsightsTab.fixtures';
import {
  INSIGHTS_HITS_REQUEST,
  INSIGHTS_HITS_SUCCESS,
} from '../InsightsTabConstants';

describe('AccountList reducer', () => {
  it('should return the initial state', () => {
    const initialState = Immutable({ hits: [] });
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle INSIGHTS_HITS_REQUEST', () => {
    const initialState = Immutable({ hits: [] });
    const action = {
      type: INSIGHTS_HITS_REQUEST,
      payload: {},
    };
    const newState = reducer(initialState, action);
    expect(newState).toHaveProperty('hits');
    expect(newState.hits).toEqual([]);
  });

  it('should handle INSIGHTS_HITS_SUCCESS', () => {
    const initialState = Immutable({ hits: [] });
    const action = {
      type: INSIGHTS_HITS_SUCCESS,
      payload: { hits },
    };
    const newState = reducer(initialState, action);
    expect(newState.hits).toEqual(hits);
  });

  it('should handle INSIGHTS_HITS_SUCCESS with missing hits in payload', () => {
    const initialState = Immutable({ hits: [] });
    const action = {
      type: INSIGHTS_HITS_SUCCESS,
      payload: {},
    };
    const newState = reducer(initialState, action);
    expect(newState).toHaveProperty('hits');
    expect(newState.hits).toBeUndefined();
  });

  it('should handle INSIGHTS_HITS_SUCCESS with undefined hits', () => {
    const initialState = Immutable({ hits: [] });
    const action = {
      type: INSIGHTS_HITS_SUCCESS,
      payload: { hits: undefined },
    };
    const newState = reducer(initialState, action);
    expect(newState).toHaveProperty('hits');
    expect(newState.hits).toBeUndefined();
  });

  it('should handle INSIGHTS_HITS_SUCCESS with null hits', () => {
    const initialState = Immutable({ hits: [] });
    const action = {
      type: INSIGHTS_HITS_SUCCESS,
      payload: { hits: null },
    };
    const newState = reducer(initialState, action);
    expect(newState).toHaveProperty('hits');
    expect(newState.hits).toBeNull();
  });
});
