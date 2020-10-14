import { testReducerSnapshotWithFixtures } from '@theforeman/test';
import reducer from '../InsightsTabReducer';
import { hits } from './InsightsTab.fixtures';
import {
  INSIGHTS_HITS_REQUEST,
  INSIGHTS_HITS_SUCCESS,
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
};

describe('AccountList reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
