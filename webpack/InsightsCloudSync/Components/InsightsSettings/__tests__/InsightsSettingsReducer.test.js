import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  INSIGHTS_SYNC_SETTING_SET,
  INSIGHTS_SYNC_SETTING_SET_FAILURE,
  INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
  INSIGHTS_SYNC_SETTINGS_GET_FAILURE,
} from '../InsightsSettingsConstants';
import reducer from '../InsightsSettingsReducer';

const fixtures = {
  'should return the initial state': {},
  'should handle INSIGHTS_SYNC_SETTINGS_GET_SUCCESS': {
    action: {
      type: INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
      payload: {
        settings: {
          insightsSyncEnabled: true,
        },
      },
    },
  },
  'should handle INSIGHTS_SYNC_SETTINGS_GET_FAILURE': {
    action: {
      type: INSIGHTS_SYNC_SETTINGS_GET_FAILURE,
      payload: {
        settings: {
          error: 'test error',
        },
      },
    },
  },
  'should handle INSIGHTS_SYNC_SETTING_SET': {
    action: {
      type: INSIGHTS_SYNC_SETTING_SET,
      payload: {
        settings: {
          insightsSyncEnabled: true,
        },
      },
    },
  },
  'should handle INSIGHTS_SYNC_SETTING_SET_FAILURE': {
    action: {
      type: INSIGHTS_SYNC_SETTING_SET_FAILURE,
      payload: {
        settings: {
          error: 'test set error',
        },
      },
    },
  },
};

describe('InsightsSettings reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
