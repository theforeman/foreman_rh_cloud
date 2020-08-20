import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer from '../InsightsTabReducer';
import { hits } from './InsightsTab.fixtures';
import {
  INSIGHTS_HITS_REQUEST,
  INSIGHTS_HITS_SUCCESS,
  INSIGHTS_HITS_FAILURE,
} from '../InsightsTabConstants';

const fixtures = {
  'should return the initial state': {},
  'should handle INSIGHTS_HITS_REQUEST': {
    action: {
      type: INSIGHTS_HITS_REQUEST,
      payload: {},
    },
  },
  'should handle INSIGHTS_HITS_SUCCESS': {
    action: {
      type: INSIGHTS_HITS_SUCCESS,
      payload: { hits },
    },
  },
  'should handle INSIGHTS_HITS_FAILURE': {
    action: {
      type: INSIGHTS_HITS_FAILURE,
      payload: {
        error: 'some-error',
      },
    },
  },
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
