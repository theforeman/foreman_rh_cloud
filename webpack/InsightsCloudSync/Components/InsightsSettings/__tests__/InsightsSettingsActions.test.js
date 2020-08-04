import { testActionSnapshotWithFixtures } from 'react-redux-test-utils';
import API from 'foremanReact/API';
import {
  getInsightsSyncSettings,
  setInsightsSyncEnabled,
} from '../InsightsSettingsActions';
import { rhCloudStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const serverMock = {
  data: { insightsSyncEnabled: true },
};

jest.mock('foremanReact/API');
API.get.mockImplementation(() => serverMock);
API.patch.mockImplementation(() => serverMock);

const runWithGetState = (state, action, params) => dispatch => {
  const getState = () => rhCloudStateWrapper({ InsightsCloudSync: state });
  action(params)(dispatch, getState);
};

const fixtures = {
  'should generate INSIGHTS_SYNC_SETTINGS_GET_SUCCESS action': () =>
    runWithGetState({ settings: {} }, getInsightsSyncSettings, {}),
  'should generate INSIGHTS_SYNC_SETTING_SET action': () =>
    runWithGetState(
      { settings: { insightsSyncEnabled: false } },
      setInsightsSyncEnabled,
      true
    ),
};

describe('InsightsSettings actions', () => {
  const { location } = window;

  beforeAll(() => {
    delete window.location;
    window.location = { href: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  return testActionSnapshotWithFixtures(fixtures);
});
