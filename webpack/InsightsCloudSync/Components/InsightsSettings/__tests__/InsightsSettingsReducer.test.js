import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer from '../InsightsSettingsReducer';
import {
  INSIGHTS_SYNC_SETTING_SET,
  INSIGHTS_SYNC_SETTINGS_GET_SUCCESS,
} from '../InsightsSettingsConstants';

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
};

describe('InsightsSettings reducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
