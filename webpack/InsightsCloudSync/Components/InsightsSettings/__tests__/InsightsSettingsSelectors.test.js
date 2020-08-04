import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';
import {
  selectSettings,
  selectInsightsSyncEnabled,
} from '../InsightsSettingsSelectors';
import { insightsStateWrapper } from '../../../../ForemanRhCloudTestHelpers';

const state = insightsStateWrapper({
  settings: {
    insightsSyncEnabled: true,
  },
});

const fixtures = {
  'should return insights sync settings': () => selectSettings(state),
  'should return insightsSyncEnabled setting': () =>
    selectInsightsSyncEnabled(state),
};

describe('InsightsSettings selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
