import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';
import { hostInsightsStateWrapper } from '../../ForemanRhCloudTestHelpers';
import { hits } from './InsightsTab.fixtures';
import { selectHits } from '../InsightsTabSelectors';

const state = hostInsightsStateWrapper({ hits });

const fixtures = {
  'should return hits': () => selectHits(state),
};

describe('InsightsTab selectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
